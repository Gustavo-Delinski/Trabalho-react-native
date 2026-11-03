import React, { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FavoriteButton from './FavoriteButton';
import { translateStatus } from '../services/api';
import { colors, radius, spacing } from '../theme';

const statusColor = (s) => (s === 'Running' ? colors.alive : s === 'Ended' ? colors.dead : colors.unknown);

// Card do catálogo: recebe os dados via props. Sem imagem (ou com erro) mostra um placeholder.
function ItemCard({ item, onPress }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = item.image && !imageFailed;
  const status = translateStatus(item.status);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onPress(item)}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${item.genre}, ${status}`}
        accessibilityHint="Abre os detalhes"
        style={({ pressed }) => [pressed && { opacity: 0.8 }]}
      >
        {showImage ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            onError={() => setImageFailed(true)}
            accessible={false}
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="person-outline" size={48} color={colors.muted} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: statusColor(item.status) }]} />
            <Text style={styles.meta} numberOfLines={1}>{status} · {item.genre}</Text>
          </View>
        </View>
      </Pressable>
      <FavoriteButton item={item} style={styles.heart} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%',
    margin: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.surfaceAlt },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  info: { padding: spacing.md, gap: spacing.xs },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  meta: { color: colors.muted, fontSize: 13, flexShrink: 1 },
  heart: { position: 'absolute', top: spacing.sm, right: spacing.sm },
});

export default memo(ItemCard);
