"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, User, RegisterResponse } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    phone: string,
    role: "customer" | "rider"
  ) => Promise<RegisterResponse["data"]>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem("akamoto_token");
      const storedUser = localStorage.getItem("akamoto_user");

      if (storedToken) {
        setToken(storedToken);

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            /* ignore */
          }
        }

        try {
          const freshUser = await api.getMe();
          if (freshUser?.role) {
            setUser(freshUser);
            localStorage.setItem("akamoto_user", JSON.stringify(freshUser));
          }
        } catch (err) {
          console.error("Failed to fetch user profile, logging out:", err);
          localStorage.removeItem("akamoto_token");
          localStorage.removeItem("akamoto_user");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = async (phone: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.login(phone, password);
      if (res.success && res.data) {
        const { token: userToken, user: loggedUser } = res.data;
        localStorage.setItem("akamoto_token", userToken);
        localStorage.setItem("akamoto_user", JSON.stringify(loggedUser));
        setToken(userToken);
        setUser(loggedUser);
        return loggedUser;
      }
      throw new Error(res.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    role: "customer" | "rider"
  ): Promise<RegisterResponse["data"]> => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, phone, role);
      if (res.success && res.data) return res.data;
      throw new Error(res.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("akamoto_token");
      localStorage.removeItem("akamoto_user");
      setToken(null);
      setUser(null);
      setIsLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
