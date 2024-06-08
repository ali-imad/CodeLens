import React from "react";
import { Link, useNavigate } from "react-router-dom";
import mockProblems from "../mockProblems";

interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, username, onLogin }) => {
  const navigate = useNavigate();

  const handleRandomProblem = () => {
    const randomId = Math.floor(Math.random() * mockProblems.length) + 1;
    navigate(`/problems/${randomId}`);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">CodeLens</Link>
      </div>
      <nav className="space-x-8 flex items-center">
        <button
          onClick={handleRandomProblem}
          className="p-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Random Problem
        </button>
        <Link
          to="/problems"
          className="p-2 bg-green-500 rounded hover:bg-green-600"
        >
          Problems
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <span>{username}</span>
            <img
              src="https://via.placeholder.com/32"
              alt="User Avatar"
              className="rounded-full w-8 h-8"
            />
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="p-2 bg-yellow-500 rounded hover:bg-yellow-600"
          >
            Log In
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
