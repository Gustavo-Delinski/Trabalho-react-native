import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { colors, MIN_TOUCH, spacing } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    setError(null);
    if (password !== confirm) {
      setError('As senhas não conferem.');
      return;
    }
    setLoading(true);
    try {
      const result = await signUp({ name, email, password });
      if (result.needsConfirmation) {
        Alert.alert('Confira seu e-mail', 'Sua conta foi criada. Confirme o endereço pelo e-mail recebido e depois entre no aplicativo.');
        navigation.goBack();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title} accessibilityRole="header">Criar conta</Text>
        <TextField label="Nome" value={name} onChangeText={setName} autoComplete="name" />
        <TextField
          label="E-mail" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email"
        />
        <TextField
          label="Senha (mínimo 6 caracteres)" value={password} onChangeText={setPassword}
          secureTextEntry autoCapitalize="none"
        />
        <TextField
          label="Confirmar senha" value={confirm} onChangeText={setConfirm}
          secureTextEntry autoCapitalize="none" onSubmitEditing={handleRegister}
        />

        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}

        <PrimaryButton
          title="Criar conta"
          onPress={handleRegister}
          loading={loading}
          disabled={!name || !email || !password || !confirm}
        />
        <Pressable
          onPress={() => navigation.goBack()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Voltar para o login"
          style={styles.link}
        >
          <Text style={styles.linkText}>Já tenho conta</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: spacing.xl },
  error: { color: colors.danger, fontSize: 15, marginBottom: spacing.md },
  link: { minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  linkText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});
