import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "./AuthContext.js";
import type { AuthContextType, DecodedToken, User } from "../types/auth";

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded: DecodedToken = jwtDecode(token);

  return {
    userId: decoded.userId,
    username: decoded.username,
    email: decoded.email,
  } as User;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(getUserFromToken);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: DecodedToken = jwtDecode(token);
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token");
    }
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Token has expired");
    }
    setUser({
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
    } as User);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  const value: AuthContextType = { user, login, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
