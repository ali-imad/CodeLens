import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { IProblem } from '../types';
import Spinner from '../utility/Spinner';

const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>('Student');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const username = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');

        if (!username || !storedRole) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        setUserRole(storedRole);

        const userResponse = await axios.get(`http://localhost:3000/users/`);
        const users = userResponse.data;

        const user = users.find(
          (u: { username: string | null }) => u.username === username,
        );

        if (storedRole === 'Instructor') {
          const response: AxiosResponse<IProblem[]> = await axios.get(
            'http://localhost:3000/problems',
          );
          setProblems(response.data);
        } else {
          const assignedProblemsDetails = await Promise.all(
            user.assignedProblems.map((problemId: string) =>
              axios.get(`http://localhost:3000/problems/${problemId}`),
            ),
          );
          setProblems(assignedProblemsDetails.map(response => response.data));
        }

        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500'>Error: {error}</div>;
  }

  if (problems.length === 0) {
    return (
      <div>
        No problems {userRole === 'Student' ? 'assigned' : 'available'}.
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold mb-4'>
        {userRole === 'Student' ? 'Assigned Problems' : 'All Problems'}
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {problems.map((problem: IProblem, index: number) => (
          <Link key={problem._id as string} to={`/problems/${problem._id}`}>
            <div className='p-4 border rounded-md shadow-md cursor-pointer'>
              <h2 className='text-xl font-semibold mb-2'>
                {userRole === 'Student'
                  ? `Problem ${index + 1}`
                  : problem.title}
              </h2>
              <p className='text-gray-600'>{`Difficulty: ${problem.difficulty}`}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemsPage;
