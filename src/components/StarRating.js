import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, MIN_TOUCH } from '../theme';

// Nota de 1 a 5 estrelas. Com onChange é editável; sem onChange é apenas exibição.
export default function StarRating({ rating = 0, onChange, size = 28 }) {
  const editable = typeof onChange === 'function';
  const stars = [1, 2, 3, 4, 5].map((n) => {
    const filled = n <= rating;
    const icon = <Ionicons name={filled ? 'star' : 'star-outline'} size={size} color={colors.star} />;
    if (!editable) return <View key={n}>{icon}</View>;
    return (
      <Pressable
        key={n}
        onPress={() => onChange(n)}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Dar nota ${n} de 5`}
        accessibilityState={{ selected: filled }}
        style={styles.touch}
        hitSlop={4}
      >
        {icon}
      </Pressable>
    );
  });
  return (
    <View
      style={styles.row}
      {...(!editable ? { accessible: true, accessibilityLabel: `Nota ${rating} de 5` } : {})}
    >
      {stars}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  touch: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
});
