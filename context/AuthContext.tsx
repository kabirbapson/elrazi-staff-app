import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import { loginUser } from "../utils/api/auth";
import { loadUserSession } from "../utils/api/helpers";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // LOGIN
  async function login(email, password) {
    const payload = { email: email.toLowerCase(), password };
    const res = await loginUser(payload);

    await SecureStore.setItemAsync("session", JSON.stringify(res.data));
    setUser(res.data.user);
  }

  // LOGOUT
  async function logout() {
    await SecureStore.deleteItemAsync("session");
    setUser(null);
  }

  // AUTO LOGIN on app start
  useEffect(() => {
    async function load() {
      const session = await loadUserSession();
      if (session?.user) {
        setUser(session.user);
      }
      setAuthChecked(true);
    }
    load();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
}
