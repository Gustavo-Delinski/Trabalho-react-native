import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFavorites } from '../contexts/FavoritesContext';
import { useConsumed } from '../contexts/ConsumedContext';
import { colors, spacing, MIN_TOUCH } from '../theme';

export default function CloudStatus() {
  const { cloud: favorites } = useFavorites();
  const { cloud: consumed } = useConsumed();
  const insets = useSafeAreaInsets();
  const busy = favorites.syncing || consumed.syncing;
  const error = favorites.error || consumed.error;
  const pending = favorites.pendingCount + consumed.pendingCount;
  const message = error || (busy ? 'Sincronizando…' : pending ? `${pending} alteração(ões) aguardando envio` : 'Dados sincronizados');
  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.xs }]}>
      {busy ? <ActivityIndicator color={colors.primary} /> : null}
      <Text style={[styles.text, error && { color: colors.danger }]} accessibilityLiveRegion="polite">{message}</Text>
      <Pressable
        onPress={() => { void favorites.retry(); void consumed.retry(); }}
        disabled={busy} accessibilityRole="button" accessibilityLabel="Sincronizar dados agora"
        accessibilityState={{ disabled: busy, busy }} style={styles.button}
      >
        <Text style={styles.link}>{error ? 'Tentar novamente' : 'Atualizar'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  text: { color: colors.muted, fontSize: 12, flex: 1, paddingVertical: spacing.sm },
  button: { minHeight: MIN_TOUCH, minWidth: MIN_TOUCH, justifyContent: 'center', paddingHorizontal: spacing.sm },
  link: { color: colors.primary, fontSize: 13, fontWeight: '600' },
});
