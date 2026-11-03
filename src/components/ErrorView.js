import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import { colors, spacing } from '../theme';

// Mensagem amigável + botão "Tentar novamente" (RF09).
export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={56} color={colors.danger} accessible={false} />
      <Text style={styles.title} accessibilityRole="header">Não foi possível carregar</Text>
      <Text style={styles.message} accessibilityRole="alert">{message}</Text>
      <PrimaryButton title="Tentar novamente" icon="refresh" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.muted, fontSize: 16, textAlign: 'center', marginBottom: spacing.sm },
});
