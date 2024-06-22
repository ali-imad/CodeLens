import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ProblemState {
  _id: string;
  title: string;
  difficulty: string;
}

const AdminHomePage: React.FC = () => {
  const [problems, setProblems] = useState<ProblemState[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/problems');
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <input
          type='text'
          placeholder='Search by name or number...'
          className='border p-2 rounded'
        />
        <button className='bg-blue-500 text-white p-2 rounded'>
          Add Problem
        </button>
      </div>
      <table className='min-w-full bg-white text-center'>
        <thead>
          <tr>
            <th className='py-2 px-4 border-b'>Problem #</th>
            <th className='py-2 px-4 border-b'>Title</th>
            <th className='py-2 px-4 border-b'>Difficulty</th>
            <th className='py-2 px-4 border-b'>Problem Page</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id}>
              <td className='py-2 px-4 border-b'>{index + 1}</td>
              <td className='py-2 px-4 border-b'>{problem.title}</td>
              <td className='py-2 px-4 border-b'>{problem.difficulty}</td>
              <td className='py-2 px-4 border-b'>
                <Link
                  key={problem._id as string}
                  to={`/problems/${problem._id}`}
                  className='text-blue-500'
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHomePage;
