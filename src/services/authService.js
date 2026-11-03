import { requireSupabase } from './supabase';

export const publicUser = (user) => user ? ({
  id: user.id, email: user.email,
  name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
}) : null;

function authError(error) {
  const messages = {
    invalid_credentials: 'E-mail ou senha incorretos.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
    user_already_exists: 'Este e-mail já está cadastrado.',
    weak_password: 'Escolha uma senha mais forte.',
    over_email_send_rate_limit: 'Muitos e-mails enviados. Aguarde alguns minutos.',
    over_request_rate_limit: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
  };
  return new Error(messages[error.code] || 'Não foi possível concluir o acesso. Confira os dados, sua conexão e tente novamente.');
}

export async function register({ name, email, password }) {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName) throw new Error('Informe seu nome.');
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) throw new Error('Informe um e-mail válido.');
  if (password.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
  const { data, error } = await requireSupabase().auth.signUp({
    email: cleanEmail, password, options: { data: { name: cleanName } },
  });
  if (error) throw authError(error);
  return { user: publicUser(data.session?.user), needsConfirmation: !data.session };
}

export async function login({ email, password }) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({
    email: email.trim().toLowerCase(), password,
  });
  if (error) throw authError(error);
  return publicUser(data.user);
}

export async function restoreSession() {
  const { data, error } = await requireSupabase().auth.getSession();
  if (error) throw authError(error);
  return publicUser(data.session?.user);
}

export async function logout() {
  const { error } = await requireSupabase().auth.signOut({ scope: 'local' });
  if (error) throw authError(error);
}
