// Luxora-Frontend/src/app/App.jsx
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { AuthProvider, AuthContext } from "../context/AuthContext.jsx";
import { BookingProvider } from "../context/BookingContext.jsx";

function AppFrame() {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading } = useContext(AuthContext);

  // Optional: show a clean loading screen while restoring session
  if (isAuthLoading) {
    return <div className="page-container">Loading...</div>;
  }

  // ✅ Never show header/footer on auth pages (even if user is logged-in)
  const onAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const showAppShell = Boolean(isAuthenticated) && !onAuthPage;

  return (
    <div className="app-shell">
      {showAppShell && <Header />}

      <main className={showAppShell ? "app-main" : undefined}>
        <AppRoutes />
      </main>

      {showAppShell && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppFrame />
      </BookingProvider>
    </AuthProvider>
  );
}
