import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { colors, MIN_TOUCH, spacing } from '../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn({ email, password });
      // Sucesso: o AuthContext muda o estado e a navegação condicional troca de Stack.
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Ionicons name="planet" size={64} color={colors.primary} accessible={false} />
          <Text style={styles.title} accessibilityRole="header">TeleLista</Text>
          <Text style={styles.subtitle}>Entre para explorar e avaliar suas séries favoritas.</Text>
        </View>

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          onSubmitEditing={handleLogin}
        />

        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}

        <PrimaryButton title="Entrar" onPress={handleLogin} loading={loading} disabled={!email || !password} />

        <Pressable
          onPress={() => navigation.navigate('Register')}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Criar uma conta nova"
          style={styles.link}
        >
          <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  hero: { alignItems: 'center', marginBottom: spacing.xl, gap: spacing.sm },
  title: { color: colors.text, fontSize: 32, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 16, textAlign: 'center' },
  error: { color: colors.danger, fontSize: 15, marginBottom: spacing.md },
  link: { minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  linkText: { color: colors.primary, fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
