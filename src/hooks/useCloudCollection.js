import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readCollection, writeItem } from '../services/cloudService';
import { recordChanges, overlayPending } from '../utils/collectionSync';

export default function useCloudCollection(userId, kind) {
  const cacheKey = `@telelista:cloud:v1:${userId}:${kind}`;
  const current = useRef({ items: [], pending: {} });
  const active = useRef(false);
  const busy = useRef(false);
  const saving = useRef(Promise.resolve());
  const syncRef = useRef(null);
  const [items, updateItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const publish = useCallback(() => {
    if (!active.current) return;
    updateItems(current.current.items);
    setPendingCount(Object.keys(current.current.pending).length);
  }, []);

  // Serializa gravações locais para uma resposta antiga não sobrescrever uma nova.
  const persist = useCallback(() => {
    const task = saving.current.catch(() => {}).then(() =>
      AsyncStorage.setItem(cacheKey, JSON.stringify(current.current)));
    saving.current = task;
    return task;
  }, [cacheKey]);

  const sync = useCallback(async () => {
    if (!active.current || busy.current) return;
    busy.current = true;
    setSyncing(true);
    setError(null);
    try {
      // Uma remoção offline também fica na fila; assim não reaparece na próxima leitura.
      while (active.current && Object.keys(current.current.pending).length) {
        const entries = Object.entries(current.current.pending);
        for (const [id, operation] of entries) {
          if (!active.current) return;
          await writeItem(userId, kind, id, operation.item);
          if (!active.current) return;
          // Preserva uma edição feita enquanto a requisição anterior estava em andamento.
          if (current.current.pending[id] === operation) {
            const pending = { ...current.current.pending };
            delete pending[id];
            current.current = { ...current.current, pending };
            await persist();
            publish();
          }
        }
      }
      const remote = await readCollection(userId, kind);
      if (!active.current) return;
      current.current = {
        ...current.current, items: overlayPending(remote, current.current.pending),
      };
      await persist();
      publish();
    } catch {
      if (active.current) setError('Não foi possível sincronizar. Suas alterações locais serão tentadas novamente.');
    } finally {
      busy.current = false;
      if (active.current) setSyncing(false);
    }
  }, [kind, userId, persist, publish]);
  useEffect(() => { syncRef.current = sync; }, [sync]);

  const setItems = useCallback((updater) => {
    const previous = current.current.items;
    const next = typeof updater === 'function' ? updater(previous) : updater;
    current.current = {
      items: next, pending: recordChanges(previous, next, current.current.pending),
    };
    publish();
    persist().then(() => syncRef.current()).catch(() => {
      if (active.current) setError('Não foi possível salvar no aparelho. Tente sincronizar novamente antes de fechar.');
    });
  }, [persist, publish]);

  useEffect(() => {
    active.current = true;
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (cancelled) return;
        if (raw) {
          const cache = JSON.parse(raw);
          if (!Array.isArray(cache.items) || !cache.pending || typeof cache.pending !== 'object') {
            throw new Error('Cache inválido');
          }
          current.current = cache;
        }
        publish();
        if (raw) setLoaded(true);
      } catch {
        if (!cancelled) setError('Não foi possível ler os dados locais. Tentando recuperar da nuvem.');
      } finally {
        if (!cancelled) {
          await syncRef.current();
          if (!cancelled) setLoaded(true);
        }
      }
    })();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncRef.current();
    });
    const timer = setInterval(() => {
      if (AppState.currentState === 'active') void syncRef.current();
    }, 30000);
    return () => {
      cancelled = true;
      active.current = false;
      clearInterval(timer);
      subscription.remove();
    };
  }, [cacheKey, publish]);

  return [items, setItems, loaded, { syncing, error, pendingCount, retry: sync }];
}
