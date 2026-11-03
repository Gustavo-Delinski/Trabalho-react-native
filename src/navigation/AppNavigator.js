import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ConsumedScreen from '../screens/ConsumedScreen';
import DetailsScreen from '../screens/DetailsScreen';
import HeaderButtons from '../components/HeaderButtons';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = {
  Catálogo: ['planet', 'planet-outline'],
  Buscar: ['search', 'search-outline'],
  Favoritos: ['heart', 'heart-outline'],
  Assistidas: ['eye', 'eye-outline'],
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerRight: () => <HeaderButtons showFavorites={route.name === 'Catálogo'} />,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
        tabBarAccessibilityLabel: route.name,
      })}
    >
      <Tab.Screen name="Catálogo" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Assistidas" component={ConsumedScreen} options={{ title: 'Séries assistidas' }} />
    </Tab.Navigator>
  );
}

// Stack exibido SOMENTE com sessão ativa (RF02): Tabs + Detalhes.
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({ title: route.params?.name ?? 'Detalhes' })}
      />
    </Stack.Navigator>
  );
}
