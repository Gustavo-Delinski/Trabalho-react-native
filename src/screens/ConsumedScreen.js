import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState';
import StarRating from '../components/StarRating';
import { useConsumed } from '../contexts/ConsumedContext';
import { colors, radius, spacing } from '../theme';

function ConsumedRow({ item, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, sua nota ${item.rating} de 5`}
      accessibilityHint="Abre os detalhes"
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.thumb} accessible={false} />
      ) : (
        <View style={[styles.thumb, styles.placeholder]}>
          <Ionicons name="person-outline" size={32} color={colors.muted} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.genre}</Text>
        <StarRating rating={item.rating} size={20} />
      </View>
    </Pressable>
  );
}

// RF07: lista dos itens "vistos" com a nota de cada um.
export default function ConsumedScreen({ navigation }) {
  const { consumed } = useConsumed();
  const open = (item) => navigation.navigate('Details', { id: item.id, name: item.name });
  return (
    <FlatList
      data={consumed}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ConsumedRow item={item} onPress={open} />}
      style={styles.list}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <EmptyState
          icon="eye-outline"
          title="Nenhuma série assistida"
          message="Abra uma série e toque em “Marcar como assistida” para dar uma nota."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
  row: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  thumb: { width: 96, height: 96, backgroundColor: colors.surfaceAlt },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: spacing.md, justifyContent: 'center', gap: 2 },
  name: { color: colors.text, fontSize: 17, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 14 },
});
