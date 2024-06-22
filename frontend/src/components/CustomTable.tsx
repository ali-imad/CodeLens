import React from 'react';
import { Link } from 'react-router-dom';
import { ProblemState } from '../pages/AdminHomePage';

interface ProblemTableProps {
  problems: ProblemState[];
  currentProblems: ProblemState[];
  selectedProblems: Set<string>;
  handleSelectAll: () => void;
  handleSelect: (id: string) => void;
  handleSort: (column: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const CustomTable: React.FC<ProblemTableProps> = ({
  problems,
  currentProblems,
  selectedProblems,
  handleSelectAll,
  handleSelect,
  handleSort,
  sortBy,
  sortOrder,
}) => {
  return (
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
              <Link to={`/problems/${problem._id}`} className='text-blue-500'>
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomTable;
