import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddProblemModal from '../components/AddProblemModal';
import { BsSearch } from 'react-icons/bs';
import { CiSquarePlus } from 'react-icons/ci';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface ProblemState {
  _id: string;
  title: string;
  difficulty: string;
}

const AdminHomePage: React.FC = () => {
  const [problems, setProblems] = useState<ProblemState[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<Set<string>>(
    new Set(),
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

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

  // Handle Pagination
  const indexOfLastProblem = currentPage * itemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - itemsPerPage;
  const currentProblems = sortedProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedProblems.size === currentProblems.length) {
      setSelectedProblems(new Set());
    } else {
      setSelectedProblems(new Set(currentProblems.map(problem => problem._id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSelectedProblems = new Set(selectedProblems);
    if (newSelectedProblems.has(id)) {
      newSelectedProblems.delete(id);
    } else {
      newSelectedProblems.add(id);
    }
    setSelectedProblems(newSelectedProblems);
  };

  return (
    <div className='container mx-auto p-4 m-10'>
      <div className='flex justify-between items-center mb-8'>
        <div className='relative w-4/12 bg-slate-100'>
          <input
            type='text'
            placeholder='Search by Problem Title...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='border p-2 pl-10 rounded w-full '
          />
          <BsSearch className='absolute top-3 left-3 text-gray-400' />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='w-full sm:w-60 md:w-72 lg:w-96 xl:w-[180px] h-12 px-3 py-4 bg-blue-600 rounded-lg border-2 border-blue-600 flex items-center space-x-2'
        >
          <CiSquarePlus className='w-7 h-7 relative text-white' />
          <div className='justify-center items-center gap-2.5 flex'>
            <div className='text-white text-base font-medium font-roboto leading-none tracking-wide'>
              Add Problem
            </div>
          </div>
        </button>
      </div>
      <table className='min-w-full bg-white text-center'>
        <thead>
          <tr>
            <th className='py-2 px-4 border-b cursor-pointer'>
              <input
                type='checkbox'
                checked={selectedProblems.size === currentProblems.length}
                onChange={handleSelectAll}
                className='form-checkbox'
              />
            </th>
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
          {currentProblems.map(problem => (
            <tr
              key={problem._id}
              className={selectedProblems.has(problem._id) ? 'bg-gray-200' : ''}
            >
              <td className='py-2 px-4 border-b'>
                <input
                  type='checkbox'
                  checked={selectedProblems.has(problem._id)}
                  onChange={() => handleSelect(problem._id)}
                  className='form-checkbox'
                />
              </td>
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
      <div className='mt-8 flex justify-end'>
        <nav className='inline-flex -space-x-px'>
          <a
            href='#'
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className='sr-only'>Previous</span>
            <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
          </a>
          {Array.from(
            { length: Math.ceil(filteredProblems.length / itemsPerPage) },
            (_, index) => (
              <a
                key={index}
                href='#'
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === index + 1
                    ? 'bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {index + 1}
              </a>
            ),
          )}
          <a
            href='#'
            onClick={() =>
              paginate(
                currentPage < Math.ceil(filteredProblems.length / itemsPerPage)
                  ? currentPage + 1
                  : currentPage,
              )
            }
            className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
              currentPage === Math.ceil(filteredProblems.length / itemsPerPage)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <span className='sr-only'>Next</span>
            <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
          </a>
        </nav>
      </div>
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
