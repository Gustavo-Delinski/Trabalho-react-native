import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { useFavorites } from '../contexts/FavoritesContext';
import { colors, spacing } from '../theme';

// RF05: lê direto do Context, então desfavoritar atualiza a lista na hora.
export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const openDetails = useCallback(
    (item) => navigation.navigate('Details', { id: item.id, name: item.name }),
    [navigation]
  );
  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ItemCard item={item} onPress={openDetails} />}
      numColumns={2}
      style={styles.list}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <EmptyState
          icon="heart-outline"
          title="Nenhum favorito ainda"
          message="Toque no coração de uma série para guardá-lo aqui."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.bg },
  content: { padding: spacing.sm, flexGrow: 1 },
});
