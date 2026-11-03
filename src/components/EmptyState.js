import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

// Estado vazio amigável: explica o que aconteceu e o que fazer.
export default function EmptyState({ icon = 'planet-outline', title, message }) {
  return (
    <View style={styles.container} accessible accessibilityLabel={`${title}. ${message}`}>
      <Ionicons name={icon} size={56} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.muted, fontSize: 16, textAlign: 'center' },
});
