// Luxora-Frontend/src/context/AuthContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginUser, logoutUser, registerUser } from "../api/authApi";
import { getAccessToken } from "../api/httpClient";

export const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Restore session on refresh if token exists
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    (async () => {
      try {
        // If backend has /auth/me, use it
        const me = await fetchMe();
        setUser(me?.user ?? me);
      } catch {
        // If /auth/me doesn't exist yet, still allow dashboard using token
        const payload = decodeJwtPayload(token);
        if (payload) {
          setUser({
            email: payload.email || payload.sub || "user@luxora.local",
            name: payload.name || payload.username || "Luxora User",
          });
        } else {
          // token exists but not decodeable -> still treat as logged in
          setUser({ email: "user@luxora.local", name: "Luxora User" });
        }
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    const token = getAccessToken();

    // Accept common backend shapes
    const resolvedUser =
      data?.user ??
      (data?.id ? data : null) ??
      decodeJwtPayload(token) ??
      { email, name: "Luxora User" };

    setUser({
      email: resolvedUser.email || resolvedUser.sub || email,
      name: resolvedUser.name || resolvedUser.username || "Luxora User",
    });

    return resolvedUser;
  };

  const register = async (name, email, password) => {
    return registerUser({ name, email, password });
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAuthenticated = Boolean(user) || Boolean(getAccessToken());

  const value = useMemo(
    () => ({
      user,
      isAuthLoading,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, isAuthLoading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
