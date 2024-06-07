import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProblemsPage from "./components/ProblemsPage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = () => {
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
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/problems/:id" element={<Dashboard />} />
            <Route path="/problems" element={<ProblemsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
