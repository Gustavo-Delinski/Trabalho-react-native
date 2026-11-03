import React, { createContext, useCallback, useContext, useMemo } from 'react';
import useCloudCollection from '../hooks/useCloudCollection';
import { useAuth } from './AuthContext';
import FullScreenLoading from '../components/FullScreenLoading';

const ConsumedContext = createContext(null);

// Itens "assistidos" com nota de 1 a 5 (RF07), persistidos por usuário.
export function ConsumedProvider({ children }) {
  const { user } = useAuth();
  const [consumed, setConsumed, loaded, cloud] = useCloudCollection(user.id, 'consumed');

  const getConsumed = useCallback((id) => consumed.find((c) => c.id === id) || null, [consumed]);

  // Marca como assistida (ou atualiza a nota). rating é limitado a 1..5.
  const markConsumed = useCallback(
    (item, rating = 3) => {
      const safe = Math.min(5, Math.max(1, Math.round(rating)));
      setConsumed((prev) => {
        const entry = {
          id: item.id, name: item.name, image: item.image, status: item.status, genre: item.genre,
          rating: safe,
        };
        return prev.some((c) => c.id === item.id)
          ? prev.map((c) => (c.id === item.id ? { ...c, rating: safe } : c))
          : [entry, ...prev];
      });
    },
    [setConsumed]
  );

  const unmarkConsumed = useCallback(
    (id) => setConsumed((prev) => prev.filter((c) => c.id !== id)),
    [setConsumed]
  );

  const value = useMemo(
    () => ({ consumed, getConsumed, markConsumed, unmarkConsumed, cloud }),
    [consumed, getConsumed, markConsumed, unmarkConsumed, cloud]
  );

  if (!loaded) return <FullScreenLoading message="Carregando suas séries assistidas…" />;
  return <ConsumedContext.Provider value={value}>{children}</ConsumedContext.Provider>;
}

export function useConsumed() {
  const ctx = useContext(ConsumedContext);
  if (!ctx) throw new Error('useConsumed deve ser usado dentro de <ConsumedProvider>');
  return ctx;
}
