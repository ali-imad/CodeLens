import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate();

  const handleRandomProblem = async () => {
    try {
      const response = await axios.get("http://localhost:3000/problems/random");
      const randomProblem = response.data;
      navigate(`/problems/${randomProblem._id}`);
    } catch (error) {
      console.error("Error fetching random problem:", error);
    }
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
            <button
              onClick={onLogout}
              className="p-2 bg-red-500 rounded hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="p-2 bg-yellow-500 rounded hover:bg-yellow-600"
          >
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
