import React from 'react';
import { Difficulty } from '../../../backend/src/models/Problem';
import { IProblem } from '../../../backend/src/models/Problem';

interface ProblemDescriptionProps {
  problem: IProblem;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const codeSnippet = problem.functionBody;
  let difficultyColor: string;
  switch (problem.difficulty) {
    case Difficulty.Easy:
      difficultyColor = 'bg-green-400';
      break;
    case Difficulty.Medium:
      difficultyColor = 'bg-yellow-400';
      break;
    case Difficulty.Hard:
      difficultyColor = 'bg-red-400';
      break;
    default:
      difficultyColor = 'bg-gray-400';
  }

  return (
    <div className='bg-white p-4 rounded shadow'>
      <div className='text-xl font-bold mb-2'>{problem.title}</div>
      <div
        className={`w-16 h-6 mr-2 mb-4 flex items-center justify-center rounded border border-black ${difficultyColor}`}
      >
        {problem.difficulty}
      </div>
      <pre className='bg-gray-100 p-4 rounded overflow-auto'>
        <code>{codeSnippet}</code>
      </pre>
    </div>
  );
};

export default ProblemDescription;
