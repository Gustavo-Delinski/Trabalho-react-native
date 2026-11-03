import React, { useCallback } from 'react';
import CatalogList from '../components/CatalogList';
import usePaginatedList from '../hooks/usePaginatedList';
import { getShows } from '../services/api';

// RF01: catálogo em grade, rolagem infinita, pull-to-refresh.
export default function HomeScreen({ navigation }) {
  const list = usePaginatedList(getShows);

  const openDetails = useCallback(
    (item) => navigation.navigate('Details', { id: item.id, name: item.name }),
    [navigation]
  );

  return (
    <CatalogList
      list={list}
      onPressItem={openDetails}
      loadingMessage="Carregando séries…"
      emptyTitle="Nada por aqui"
      emptyMessage="Puxe a tela para baixo para atualizar."
    />
  );
}
