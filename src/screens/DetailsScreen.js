import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFetch from '../hooks/useFetch';
import { getShow, translateStatus } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';
import { useConsumed } from '../contexts/ConsumedContext';
import FullScreenLoading from '../components/FullScreenLoading';
import ErrorView from '../components/ErrorView';
import PrimaryButton from '../components/PrimaryButton';
import StarRating from '../components/StarRating';
import { colors, radius, spacing } from '../theme';

// 'AAAA-MM-DD' -> 'DD/MM/AAAA'
function formatDate(date) {
  if (!date) return '—';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

function Attribute({ label, value }) {
  return (
    <View style={styles.attr} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.attrLabel}>{label}</Text>
      <Text style={styles.attrValue}>{value}</Text>
    </View>
  );
}

// RF03 + RF04 + RF07: detalhes, favoritar e marcar como assistida com nota.
export default function DetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const { data: item, status, error, retry } = useFetch((signal) => getShow(id, signal), [id]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getConsumed, markConsumed, unmarkConsumed } = useConsumed();
  const [imageFailed, setImageFailed] = useState(false);

  // Título do header dinâmico com o nome do item (RF02).
  useEffect(() => {
    if (item?.name) navigation.setOptions({ title: item.name });
  }, [item?.name, navigation]);

  if (status === 'loading') return <FullScreenLoading message="Carregando detalhes…" />;
  if (status === 'error') return <ErrorView message={error} onRetry={retry} />;

  const favorite = isFavorite(item.id);
  const consumed = getConsumed(item.id);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {item.image && !imageFailed ? (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          onError={() => setImageFailed(true)}
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Foto de ${item.name}`}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} accessible accessibilityLabel={`Sem imagem de ${item.name}`}>
          <Ionicons name="person-outline" size={96} color={colors.muted} />
        </View>
      )}

      <Text style={styles.name} accessibilityRole="header">{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.actions}>
        <PrimaryButton
          title={favorite ? 'Favorito' : 'Favoritar'}
          icon={favorite ? 'heart' : 'heart-outline'}
          variant={favorite ? 'primary' : 'outline'}
          selected={favorite}
          accessibilityLabel={favorite ? `${item.name} está nos favoritos. Toque para remover` : `Adicionar ${item.name} aos favoritos`}
          onPress={() => toggleFavorite(item)}
        />
        <PrimaryButton
          title={consumed ? 'Assistida' : 'Marcar como assistida'}
          icon={consumed ? 'checkmark-circle' : 'eye-outline'}
          variant={consumed ? 'primary' : 'outline'}
          selected={Boolean(consumed)}
          accessibilityLabel={consumed ? `${item.name} está marcada como assistida. Toque para remover` : `Marcar ${item.name} como assistida`}
          onPress={() => (consumed ? unmarkConsumed(item.id) : markConsumed(item, 3))}
        />
      </View>

      {consumed ? (
        <View style={styles.rating}>
          <Text style={styles.sectionTitle}>Sua nota: {consumed.rating} de 5</Text>
          <StarRating rating={consumed.rating} onChange={(n) => markConsumed(item, n)} />
        </View>
      ) : null}

      <Text style={styles.sectionTitle} accessibilityRole="header">Informações</Text>
      <View style={styles.attrs}>
        <Attribute label="Status" value={translateStatus(item.status)} />
        <Attribute label="Gêneros" value={item.genres.length ? item.genres.join(', ') : '—'} />
        <Attribute label="Tipo" value={item.type || '—'} />
        <Attribute label="Idioma" value={item.language || '—'} />
        <Attribute label="Estreia" value={formatDate(item.premiered)} />
        {item.ended ? <Attribute label="Encerramento" value={formatDate(item.ended)} /> : null}
        <Attribute label="Nota média" value={item.rating ? `${item.rating} / 10` : 'Sem nota'} />
        <Attribute label="Emissora" value={item.network || '—'} />
        <Attribute label="Duração por episódio" value={item.runtime ? `${item.runtime} min` : '—'} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, gap: spacing.md },
  image: { width: '100%', maxWidth: 420, aspectRatio: 1, alignSelf: 'center', borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 28, fontWeight: '800' },
  description: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  actions: { gap: spacing.md },
  rating: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  attrs: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  attr: { padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  attrLabel: { color: colors.muted, fontSize: 14 },
  attrValue: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 2 },
});
