import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, logout as apiLogout, me as apiMe } from "../api";

interface AuthState {
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend "who am I?" using whatever cookie the browser has.
  // 200 -> we're logged in; 401 -> we're not. This is how a refresh stays logged in.
  useEffect(() => {
    apiMe()
      .then((res) => setEmail(res.email))
      .catch(() => setEmail(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(e: string, p: string) {
    const res = await apiLogin(e, p);
    setEmail(res.email);
  }

  async function logout() {
    await apiLogout();
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ email, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
