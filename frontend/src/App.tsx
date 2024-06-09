import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

  const handleLogin: () => void = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUsername("");
    } else {
      setIsLoggedIn(true);
      setUsername("John Doe");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogin={handleLogin}
        />
        <div>
          {!isLoggedIn && (
            <div className="max-w-lg mx-auto p-24 mt-24">
              <h4 className="text-xl font-semibold mb-6">
                Welcome to CodeLens! You are not permitted to view our problems
                until you have logged in.
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
          )}
          {isLoggedIn && (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:id" element={<Dashboard />} />
            </Routes>
          )}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
