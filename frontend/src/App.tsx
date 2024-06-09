import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProblemsPage from "./pages/ProblemsPage";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:id" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
