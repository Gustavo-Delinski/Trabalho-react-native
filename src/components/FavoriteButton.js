import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../contexts/FavoritesContext';
import { colors, MIN_TOUCH } from '../theme';

// Ícone de coração ligado ao Context: o mesmo estado vale no catálogo, na busca e nos detalhes.
export default function FavoriteButton({ item, style }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item.id);
  return (
    <Pressable
      onPress={() => toggleFavorite(item)}
      hitSlop={6}
      accessible
      accessibilityRole="button"
      accessibilityLabel={active ? `Remover ${item.name} dos favoritos` : `Adicionar ${item.name} aos favoritos`}
      accessibilityState={{ selected: active }}
      style={[styles.button, style]}
    >
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={24} color={active ? colors.heart : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,19,36,0.78)',
  },
});
