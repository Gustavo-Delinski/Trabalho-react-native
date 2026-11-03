import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, MIN_TOUCH, radius, spacing } from '../theme';

// Campo de texto controlado com rótulo visível (também usado como accessibilityLabel).
export default function TextField({ label, value, onChangeText, ...rest }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: spacing.xs },
  input: {
    minHeight: MIN_TOUCH + 4,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
});
