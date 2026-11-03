import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { AppState } from 'react-native';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [restoring, setRestoring] = useState(true); // true enquanto lê a sessão salva
  const [restoreError, setRestoreError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let receivedEvent = false;
    const listener = supabase?.auth.onAuthStateChange((_event, session) => {
      receivedEvent = true;
      if (active) setUser(authService.publicUser(session?.user));
    });
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase?.auth.startAutoRefresh();
      else supabase?.auth.stopAutoRefresh();
    });
    if (AppState.currentState === 'active') supabase?.auth.startAutoRefresh();
    authService
      .restoreSession()
      .then((u) => { if (active && !receivedEvent) setUser(u); })
      .catch((e) => { if (active) setRestoreError(e.message); })
      .finally(() => active && setRestoring(false));
    return () => {
      active = false;
      listener?.data.subscription.unsubscribe();
      appState.remove();
      supabase?.auth.stopAutoRefresh();
    };
  }, [attempt]);

  const signIn = useCallback(async (credentials) => {
    setUser(await authService.login(credentials));
  }, []);

  const signUp = useCallback(async (data) => {
    const result = await authService.register(data);
    if (result.user) setUser(result.user);
    return result;
  }, []);

  const retryRestore = useCallback(() => {
    setRestoring(true);
    setRestoreError(null);
    setAttempt((n) => n + 1);
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null); // a navegação condicional troca o Stack automaticamente
  }, []);

  const value = useMemo(
    () => ({ user, restoring, restoreError, retryRestore, signIn, signUp, signOut }),
    [user, restoring, restoreError, retryRestore, signIn, signUp, signOut]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
