import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Code Comprehension Tutor
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Enhance Your Code Comprehension Skills
        </p>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Welcome to the CodeLens! Improve your understanding of JavaScript by
          describing code snippets and testing your comprehension against
          generated solutions.
        </p>
        <div className="space-x-4">
          <Link
            to="/problems"
            className="px-6 py-3 bg-red-500 rounded hover:bg-red-600"
          >
            START LEARNING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
