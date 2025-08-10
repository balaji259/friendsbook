import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [authuser, setAuthUser] = useState(() => {
    const savedUser = localStorage.getItem("authuser");
    return savedUser ? JSON.parse(savedUser) : null;
  });


  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (authuser) localStorage.setItem("authuser", JSON.stringify(authuser));
    else localStorage.removeItem("authuser");
  }, [authuser]);

  return (
    <AuthContext.Provider value={{ token, setToken, authuser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

