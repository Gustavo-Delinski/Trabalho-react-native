import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, MIN_TOUCH, radius, spacing } from '../theme';

// Botão reutilizável. variant: 'primary' | 'outline'.
export default function PrimaryButton({
  title, onPress, loading = false, disabled = false, variant = 'primary', icon,
  accessibilityLabel, accessibilityHint, selected, style,
}) {
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? colors.onPrimary : colors.text;
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading, ...(selected !== undefined ? { selected } : {}) }}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        inactive && styles.inactive,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={fg} style={styles.icon} /> : null}
          <Text style={[styles.text, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH + 4, // sem altura fixa: cresce com fonte ampliada
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
  inactive: { opacity: 0.6 },
  icon: { marginRight: spacing.sm },
  text: { fontSize: 16, fontWeight: '700', flexShrink: 1, textAlign: 'center' },
});
