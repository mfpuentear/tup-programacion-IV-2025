import { createContext, useContext, useState } from "react";

// Contexto para compartir el estado de autenticacion/autorizacion
const AuthContext = createContext(null);

// Hook personzalizado para acceder al contexto de auth
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [roles, setRoles] = useState(null);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const session = await response.json();

      if (!response.ok && response.status === 400) {
        throw new Error(session.error);
      }

      setToken(session.token);
      setUsername(session.username);
      setRoles(session.roles);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRoles(null);
    setError(null);
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No esta iniciada la session");
    }

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  return (
    <AuthContext.Provider
      value={{ token, username, roles, error, login, logout, fetchAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
