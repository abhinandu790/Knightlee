import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./client";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post("/auth/login/", { username, password });
    localStorage.setItem("accessToken", res.data.access);
    localStorage.setItem("refreshToken", res.data.refresh);
    setIsAuthenticated(true);
  };

  const register = async (username: string, password: string) => {
    await api.post("/auth/register/", { username, password });
    // optionally auto-login
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
