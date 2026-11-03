import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estado que persiste no AsyncStorage (RF06).
// - O carregamento inicial acontece em um useEffect.
// - `loaded` só vira true depois da leitura, para a UI não exibir dados "zerados" antes disso.
export default function usePersistedState(storageKey, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);
  const skipNextSave = useRef(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (active && raw) setValue(JSON.parse(raw));
      } catch (e) {
        // Dado corrompido ou indisponível: segue com o valor inicial.
      } finally {
        if (active) {
          skipNextSave.current = true; // não regrava o que acabou de ser lido
          setLoaded(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    AsyncStorage.setItem(storageKey, JSON.stringify(value)).catch(() => {});
  }, [value, loaded, storageKey]);

  return [value, setValue, loaded];
}
