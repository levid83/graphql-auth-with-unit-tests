import React from "react";

export const AuthContext = React.createContext();
const Provider = AuthContext.Provider;

export function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = React.useState({
    userData: null,
  });

  const isAuthenticated = authInfo.userData;

  return (
    <Provider value={{ authInfo, isAuthenticated, setAuthInfo }}>
      {children}
    </Provider>
  );
}
