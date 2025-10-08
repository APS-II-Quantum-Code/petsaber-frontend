import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthAPI } from "@/lib/api";

export type UserRole = "TUTOR" | "CONSULTOR";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (input: { email: string; senha: string; }) => Promise<AuthUser>;
  register: (input: { nome: string; email: string; senha: string; role: "TUTOR" }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = "petsaber_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { user: AuthUser; token: string };
        setState({ user: parsed.user, token: parsed.token, loading: false });
        return;
      } catch (e) {
        console.warn("Failed to parse auth state from localStorage", e);
      }
    }
    setState((s) => ({ ...s, loading: false }));
  }, []);

  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem(LS_KEY, JSON.stringify({ user: state.user, token: state.token }));
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [state.user, state.token]);

  const login: AuthContextValue["login"] = async (input) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      // Backend returns: { token, idUser, nome, email, role }
      const raw = await AuthAPI.login<{
        token: string;
        idUser: number | string;
        nome: string;
        email: string;
        role: UserRole;
      }>(input);

      const user: AuthUser = {
        id: String(raw.idUser),
        nome: raw.nome,
        email: raw.email,
        role: raw.role,
      };

      setState({ user, token: raw.token, loading: false });
      return user;
    } catch (e) {
      setState((s) => ({ ...s, loading: false }));
      throw e;
    }
  };

  const register: AuthContextValue["register"] = async (input) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      await AuthAPI.register<unknown>({
        nome: input.nome,
        email: input.email,
        senha: input.senha,
        role: input.role,
      });
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const logout = () => setState({ user: null, token: null, loading: false });

  const value = useMemo(
    () => ({ ...state, login, register, logout }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
