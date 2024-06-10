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
import { Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const handleLoginSuccess = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
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
              <Route
                path="/"
                element={
                  <div className="max-w-lg mx-auto p-24 mt-24">
                    <h4 className="text-xl font-semibold mb-6">
                      Welcome to CodeLens! You are not permitted to view our
                      problems until you have logged in.
                    </h4>
                    <div className="flex flex-col space-y-4">
                      <Link
                        to="/login"
                        className="w-full p-3 bg-blue-500 text-center text-white rounded hover:bg-blue-700"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="w-full p-3 bg-gray-200 text-center text-gray-800 rounded border border-gray-300 hover:bg-gray-300"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                }
              />
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
