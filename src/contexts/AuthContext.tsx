import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type AuthUser, ApiError, type Role } from "@/lib/api-client";
import { useAppStore } from "@/store/useAppStore";

interface LoginResult {
  twoFactorRequired: boolean;
  userId?: string;
  devCode?: string;
  user?: AuthUser;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyTwoFactor: (userId: string, code: string) => Promise<AuthUser>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: Role;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  enableTwoFactor: () => Promise<void>;
  disableTwoFactor: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await api.get<AuthUser>("/api/auth/me");
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
      } else {
        console.error("[auth] a atualização falhou:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<LoginResult>("/api/auth/login", {
        email,
        password,
      });
      if (!res.twoFactorRequired && res.user) {
        setUser(res.user);
      }
      return res;
    },
    [],
  );

  const verifyTwoFactor = useCallback(async (userId: string, code: string) => {
    const res = await api.post<{ user: AuthUser }>("/api/auth/verify-2fa", {
      userId,
      code,
    });
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      role?: Role;
    }) => {
      return api.post<AuthUser>("/api/auth/register", data);
    },
    [],
  );

  const storeLogout = useAppStore(state => state.logout);
  const logout = useCallback(async () => {
    try {
      if (window.api) {
        await window.api.logout();
      } else {
        await api.post("/api/auth/logout");
      }
    } catch (e) {
      console.error("Erro ao fazer logout", e);
    } finally {
      setUser(null);
      storeLogout();
    }
  }, [storeLogout]);

  const enableTwoFactor = useCallback(async () => {
    await api.post("/api/auth/2fa/enable");
    await refresh();
  }, [refresh]);

  const disableTwoFactor = useCallback(async () => {
    await api.post("/api/auth/2fa/disable");
    await refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      role: user?.role ?? null,
      login,
      verifyTwoFactor,
      register,
      logout,
      refresh,
      enableTwoFactor,
      disableTwoFactor,
    }),
    [
      user,
      loading,
      login,
      verifyTwoFactor,
      register,
      logout,
      refresh,
      enableTwoFactor,
      disableTwoFactor,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
