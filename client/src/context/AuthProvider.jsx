import { createContext, useState } from "react";

export const AuthContext = createContext();
const Provider = AuthContext.Provider;

export function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({
    userData: null,
  });

  const isAuthenticated = authInfo.userData;
  const isAdmin = authInfo.userData?.role === "ADMIN";

  return (
    <Provider value={{ authInfo, isAuthenticated, setAuthInfo, isAdmin }}>
      {children}
    </Provider>
  );
}
