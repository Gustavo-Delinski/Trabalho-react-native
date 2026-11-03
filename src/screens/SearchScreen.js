import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import CatalogList from '../components/CatalogList';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import usePaginatedList from '../hooks/usePaginatedList';
import { searchShows } from '../services/api';
import { colors, MIN_TOUCH, radius, spacing } from '../theme';

// Resultados de uma busca. Montado com key={query}, então cada busca começa com estado limpo.
function SearchResults({ query, navigation }) {
  const fetchPage = useCallback((page, signal) => searchShows(query, page, signal), [query]);
  const list = usePaginatedList(fetchPage);
  const openDetails = useCallback(
    (item) => navigation.navigate('Details', { id: item.id, name: item.name }),
    [navigation]
  );
  return (
    <CatalogList
      list={list}
      onPressItem={openDetails}
      loadingMessage={`Buscando "${query}"…`}
      emptyTitle="Nenhum resultado"
      emptyMessage={`Não encontramos nada para "${query}". Tente outro nome.`}
    />
  );
}

// RF08: TextInput controlado + botão "Buscar"; resultados em lista, toque abre os detalhes.
export default function SearchScreen({ navigation }) {
  const [text, setText] = useState('');
  const [query, setQuery] = useState(null);

  const submit = () => {
    const trimmed = text.trim();
    if (trimmed) setQuery(trimmed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Nome da série (ex.: Breaking Bad)"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          onSubmitEditing={submit}
          autoCorrect={false}
          accessibilityLabel="Campo de busca por nome da série"
        />
        <PrimaryButton
          title="Buscar"
          icon="search"
          onPress={submit}
          disabled={!text.trim()}
          accessibilityLabel="Buscar série"
        />
      </View>
      <View style={styles.results}>
        {query ? (
          <SearchResults key={query} query={query} navigation={navigation} />
        ) : (
          <EmptyState
            icon="telescope-outline"
            title="Procure uma série"
            message="Digite um nome e toque em Buscar."
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  form: { padding: spacing.lg, gap: spacing.md },
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
  results: { flex: 1 },
});
