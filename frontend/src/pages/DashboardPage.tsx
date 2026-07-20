import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="card">
      <h1>Welcome, {email} 👋</h1>
      <p>
        You are logged in. This page is protected — the server read your httpOnly
        cookie and verified the JWT signature to let you see it.
      </p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
