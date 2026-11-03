import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ConsumedProvider } from '../contexts/ConsumedContext';
import FullScreenLoading from '../components/FullScreenLoading';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import ErrorView from '../components/ErrorView';
import CloudStatus from '../components/CloudStatus';
import { View } from 'react-native';
import { colors } from '../theme';

// Navegação condicional (RF07): o estado de sessão decide qual Stack renderizar.
// Por isso o logout não usa navigation.navigate('Login'): basta limpar o usuário.
export default function RootNavigator() {
  const { user, restoring, restoreError, retryRestore } = useAuth();

  if (restoring) return <FullScreenLoading message="Abrindo o portal…" />;
  if (restoreError) return <ErrorView message={restoreError} onRetry={retryRestore} />;
  if (!user) return <AuthNavigator />;

  // key={user.id}: ao trocar de usuário, os providers remontam e carregam os dados dele.
  return (
    <FavoritesProvider key={user.id}>
      <ConsumedProvider>
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <CloudStatus />
          <AppNavigator />
        </View>
      </ConsumedProvider>
    </FavoritesProvider>
  );
}
