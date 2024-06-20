import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProblemsPage from "./pages/ProblemsPage";
import HomePage from "./pages/HomePage";
import NotLoggedInPage from "./pages/NotLoggedInPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("email") ? true : false
  );
  const [username, setUsername] = useState<string>(
    localStorage.getItem("username") || ""
  );

  const handleLoginSuccess = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
        />
        <div>
          {isLoggedIn ? (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:id" element={<Dashboard />} />
              {/* Redirect to homepage when logged in */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<NotLoggedInPage />} />
              <Route path="/problems" element={<NotLoggedInPage />} />
              <Route path="/problems/:id" element={<NotLoggedInPage />} />
              <Route
                path="/login"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/register"
                element={
                  <RegistrationPage onLoginSuccess={handleLoginSuccess} />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
