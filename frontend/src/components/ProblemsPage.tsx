import React from "react";
import { Link } from "react-router-dom";
import { Problem } from "../types";
import mockProblems from "../mockProblems";

const ProblemsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Problems</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProblems.map((problem: Problem) => (
          <Link key={problem.id} to={`/problems/${problem.id}`}>
            <div className="p-4 border rounded-md shadow-md cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
              <p className="text-gray-600">{`Difficulty: ${problem.difficulty}`}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemsPage;
