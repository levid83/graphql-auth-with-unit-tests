import React from "react";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ApolloProvider } from "./context/ApolloProvider";
import { AuthProvider } from "./context/AuthProvider";
import { useAppInit } from "./useAppInit";

function AppRouter() {
  const { loading } = useAppInit();
  return (
    <div id="wrapper">
      <BrowserRouter>
        <Header />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Routes>
            <Route path="auth/*" element={<Auth />} />
            <Route path="/" element={<Home />} />
          </Routes>
        )}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ApolloProvider>
        <AppRouter />
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
