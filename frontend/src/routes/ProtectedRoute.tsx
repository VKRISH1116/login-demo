import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";

// Wraps a page that requires login. If there's no logged-in user, redirect to /login.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { email, loading } = useAuth();

  if (loading) {
    return <p>Loading…</p>;   // wait for the /api/me check before deciding
  }
  if (!email) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
