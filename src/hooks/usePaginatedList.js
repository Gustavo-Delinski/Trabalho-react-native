import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getErrorMessage } from '../utils/errors';

// Lista paginada com rolagem infinita, pull-to-refresh e tratamento de falhas.
// fetchPage(page, signal) deve devolver { results, hasNext } e precisa ter identidade estável (useCallback).
export default function usePaginatedList(fetchPage) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'data'
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(null);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const busyRef = useRef(false);
  const requestId = useRef(0); // invalida respostas antigas (refresh/troca de busca/desmontagem)
  const controllerRef = useRef(null);

  const loadFirst = useCallback(
    async (mode) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const id = ++requestId.current;
      busyRef.current = true;
      setMoreError(null);
      setLoadingMore(false);
      if (mode === 'initial') setStatus('loading');
      if (mode === 'refresh') setRefreshing(true);

      try {
        const { results, hasNext } = await fetchPage(1, controller.signal);
        if (id !== requestId.current) return;
        pageRef.current = 1;
        hasMoreRef.current = hasNext;
        setItems(results);
        setError(null);
        setStatus('data');
      } catch (err) {
        if (id !== requestId.current || axios.isCancel(err)) return;
        setError(getErrorMessage(err));
        setStatus('error');
      } finally {
        if (id === requestId.current) {
          busyRef.current = false;
          setRefreshing(false);
        }
      }
    },
    [fetchPage]
  );

  const loadMore = useCallback(async () => {
    if (busyRef.current || !hasMoreRef.current || status !== 'data') return;
    const id = requestId.current;
    const controller = controllerRef.current;
    busyRef.current = true;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const nextPage = pageRef.current + 1;
      const { results, hasNext } = await fetchPage(nextPage, controller?.signal);
      if (id !== requestId.current) return;
      pageRef.current = nextPage;
      hasMoreRef.current = hasNext;
      // Anexa à lista existente, sem duplicar ids.
      setItems((prev) => {
        const known = new Set(prev.map((i) => i.id));
        return [...prev, ...results.filter((i) => !known.has(i.id))];
      });
    } catch (err) {
      if (id !== requestId.current || axios.isCancel(err)) return;
      setMoreError(getErrorMessage(err));
    } finally {
      if (id === requestId.current) {
        busyRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [fetchPage, status]);

  // Carga inicial. O cleanup invalida/cancela qualquer requisição em andamento.
  useEffect(() => {
    // Inicia a sincronização com a API e sinaliza carregamento para a interface.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFirst('initial');
    return () => {
      requestId.current += 1;
      controllerRef.current?.abort();
    };
  }, [loadFirst]);

  const refresh = useCallback(() => loadFirst('refresh'), [loadFirst]);
  const retry = useCallback(() => loadFirst('initial'), [loadFirst]);

  return { items, status, error, refreshing, loadingMore, moreError, loadMore, refresh, retry };
}
