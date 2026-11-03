import React, { createContext, useCallback, useContext, useMemo } from 'react';
import useCloudCollection from '../hooks/useCloudCollection';
import { useAuth } from './AuthContext';
import FullScreenLoading from '../components/FullScreenLoading';

const FavoritesContext = createContext(null);

// Favoritos globais (RF04) e persistidos por usuário (RF06).
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites, loaded, cloud] = useCloudCollection(user.id, 'favorite');

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = useCallback((id) => favoriteIds.has(id), [favoriteIds]);

  const toggleFavorite = useCallback(
    (item) => {
      setFavorites((prev) =>
        prev.some((f) => f.id === item.id)
          ? prev.filter((f) => f.id !== item.id)
          : [{ id: item.id, name: item.name, image: item.image, status: item.status, genre: item.genre }, ...prev]
      );
    },
    [setFavorites]
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, cloud }),
    [favorites, isFavorite, toggleFavorite, cloud]
  );

  // Não mostra dados "zerados" enquanto o AsyncStorage ainda está sendo lido.
  if (!loaded) return <FullScreenLoading message="Carregando seus favoritos…" />;
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites deve ser usado dentro de <FavoritesProvider>');
  return ctx;
}
