import React, { useEffect, useState } from 'react';
import { Difficulty, IProblem } from '../types';

interface ProblemDescriptionProps {
  problem: IProblem;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const [userRole, setUserRole] = useState<string>('Student');
  const codeSnippet = problem.functionBody;

  const functionRegex = /(function\s+)(\w+)\s*\(/;

  const renameFunction = (
    functionString: string,
    newFunctionName: string,
  ): string => {
    return functionString.replace(functionRegex, `$1${newFunctionName}(`);
  };

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

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <div className='bg-white p-4 rounded shadow'>
      <div className='text-xl font-bold mb-2'>
        {userRole === 'Student' ? 'Problem' : problem.title}
      </div>
      <div
        className={`w-16 h-6 mr-2 mb-4 flex items-center justify-center rounded border border-black ${difficultyColor}`}
      >
        {problem.difficulty}
      </div>
      <pre className='bg-gray-100 p-4 rounded overflow-auto'>
        <code>
          {userRole === 'Student'
            ? renameFunction(codeSnippet, 'foo')
            : codeSnippet}
        </code>
      </pre>
    </div>
  );
};

export default ProblemDescription;
