import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import ItemCard from './ItemCard';
import ErrorView from './ErrorView';
import EmptyState from './EmptyState';
import FullScreenLoading from './FullScreenLoading';
import PrimaryButton from './PrimaryButton';
import { colors, spacing } from '../theme';

// Lista em grade reutilizada no catálogo e na busca.
// Trata explicitamente loading / error / data (RF09) e usa as props da FlatList pedidas no RF01.
export default function CatalogList({
  list, onPressItem, emptyTitle, emptyMessage, loadingMessage = 'Carregando…',
}) {
  const { items, status, error, refreshing, loadingMore, moreError, loadMore, refresh, retry } = list;

  const renderItem = useCallback(
    ({ item }) => <ItemCard item={item} onPress={onPressItem} />,
    [onPressItem]
  );
  const keyExtractor = useCallback((item) => String(item.id), []);

  if (status === 'loading') return <FullScreenLoading message={loadingMessage} />;
  if (status === 'error') return <ErrorView message={error} onRetry={retry} />;

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      contentContainerStyle={styles.content}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={refresh}
      ListEmptyComponent={<EmptyState icon="search-outline" title={emptyTitle} message={emptyMessage} />}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer} accessible accessibilityLabel="Carregando mais itens" accessibilityRole="progressbar">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : moreError ? (
          <View style={styles.footer}>
            <Text style={styles.footerError} accessibilityRole="alert">{moreError}</Text>
            <PrimaryButton title="Tentar novamente" variant="outline" icon="refresh" onPress={loadMore} />
          </View>
        ) : null
      }
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.bg },
  content: { padding: spacing.sm, flexGrow: 1 },
  footer: { padding: spacing.lg, alignItems: 'center', gap: spacing.md },
  footerError: { color: colors.danger, fontSize: 15, textAlign: 'center' },
});
