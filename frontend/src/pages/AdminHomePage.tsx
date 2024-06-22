import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddProblemModal from '../components/AddProblemModal';
import { BsSearch } from 'react-icons/bs';

interface ProblemState {
  _id: string;
  title: string;
  difficulty: string;
}

const AdminHomePage: React.FC = () => {
  const [problems, setProblems] = useState<ProblemState[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const handleProblemAdded = () => {
    axios.get('http://localhost:3000/problems').then(response => {
      setProblems(response.data);
    });
  };

  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === '') return 0;
    if (sortBy === '_id') {
      return sortOrder === 'asc'
        ? problems.indexOf(a) - problems.indexOf(b)
        : problems.indexOf(b) - problems.indexOf(a);
    } else {
      const compareResult = a[sortBy].localeCompare(b[sortBy]);
      return sortOrder === 'asc' ? compareResult : -compareResult;
    }
  });

  return (
    <div className='container mx-auto p-4 m-8'>
      <div className='flex justify-between items-center mb-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search by Problem Title'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='border p-2 pl-10 rounded w-full '
          />
          <BsSearch className='absolute top-3 left-3 text-gray-400' />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='bg-blue-500 text-white p-2 rounded'
        >
          Add Problem
        </button>
      </div>
      <table className='min-w-full bg-white text-center'>
        <thead>
          <tr>
            <th
              className='py-2 px-4 border-b cursor-pointer'
              onClick={() => handleSort('_id')}
            >
              Problem #
              {sortBy === '_id' && (
                <span className='ml-1'>{sortOrder === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th
              className='py-2 px-4 border-b cursor-pointer'
              onClick={() => handleSort('title')}
            >
              Title
              {sortBy === 'title' && (
                <span className='ml-1'>{sortOrder === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th
              className='py-2 px-4 border-b cursor-pointer'
              onClick={() => handleSort('difficulty')}
            >
              Difficulty
              {sortBy === 'difficulty' && (
                <span className='ml-1'>{sortOrder === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th className='py-2 px-4 border-b'>Problem Page</th>
          </tr>
        </thead>
        <tbody>
          {sortedProblems.map(problem => (
            <tr key={problem._id}>
              <td className='py-2 px-4 border-b'>
                {problems.indexOf(problem) + 1}
              </td>
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
      {showModal && (
        <AddProblemModal
          onClose={() => setShowModal(false)}
          onProblemAdded={handleProblemAdded}
        />
      )}
    </div>
  );
};

export default AdminHomePage;
