import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { IProblem } from '../../../backend/src/models/Problem';

const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response: AxiosResponse<IProblem[]> = await axios.get(
          'http://localhost:3000/problems',
        );
        setProblems(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold mb-4'>Problems</h1>
      {error ? (
        <div className='text-red-500'>Error: {error}</div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {problems.map((problem: IProblem) => (
            <Link key={problem._id as string} to={`/problems/${problem._id}`}>
              <div className='p-4 border rounded-md shadow-md cursor-pointer'>
                <h2 className='text-xl font-semibold mb-2'>{problem.title}</h2>
                <p className='text-gray-600'>{`Difficulty: ${problem.difficulty}`}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
