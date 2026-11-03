import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { colors, MIN_TOUCH, spacing } from '../theme';

// Ações do header: atalho para Favoritos (opcional) e Logout.
export default function HeaderButtons({ showFavorites = false }) {
  const navigation = useNavigation();
  const { signOut, user } = useAuth();
  const { favorites } = useFavorites();

  const confirmLogout = () =>
    Alert.alert('Sair da conta', `Deseja sair, ${user?.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => {
        signOut().catch((e) => Alert.alert('Não foi possível sair', e.message));
      } },
    ]);

  return (
    <View style={styles.row}>
      {showFavorites ? (
        <Pressable
          onPress={() => navigation.navigate('Favoritos')}
          hitSlop={6}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Abrir favoritos, ${favorites.length} ${favorites.length === 1 ? 'item' : 'itens'}`}
          style={styles.touch}
        >
          <Ionicons name="heart" size={24} color={colors.heart} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={confirmLogout}
        hitSlop={6}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        style={styles.touch}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.xs },
  touch: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
});
