import React from "react";
import { Problem } from "../types";

interface ProblemDescriptionProps {
  problem: Problem;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const codeSnippet = problem.functionBody;
  let difficultyColor: string;
  switch (problem.difficulty.toLowerCase()) {
    case "easy":
      difficultyColor = "bg-green-400";
      break;
    case "medium":
      difficultyColor = "bg-yellow-400";
      break;
    case "hard":
      difficultyColor = "bg-red-400";
      break;
    default:
      difficultyColor = "bg-gray-400";
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className={`text-xl font-bold mb-2`}>{problem.title}</div>
      <div className={`w-16 h-6 mr-2 mb-4 ${difficultyColor}`}>
        {problem.difficulty}
      </div>
      <pre className="bg-gray-100 p-4 rounded">
        <code>{codeSnippet}</code>
      </pre>
    </div>
  );
};

export default ProblemDescription;
