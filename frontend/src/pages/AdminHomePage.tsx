import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomTable from '../components/CustomTable';
import AddProblemModal from '../components/AddProblemModal';
import { BsSearch } from 'react-icons/bs';
import { CiSquarePlus } from 'react-icons/ci';
import Pagination from '../components/Pagination';
import CustomButton from '../components/CustomButton';

export interface ProblemState {
  _id: string;
  title: string;
  difficulty: string;

  [key: string]: string;
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
  const itemsPerPage = 5;

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
      const compareResult = (
        a[sortBy as keyof ProblemState] || ''
      ).localeCompare(b[sortBy as keyof ProblemState] || '');
      return sortOrder === 'asc' ? compareResult : -compareResult;
    }
  });

  const indexOfLastProblem = currentPage * itemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - itemsPerPage;
  const currentProblems = sortedProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
        <CustomButton
          onClick={() => setShowModal(true)}
          text='Add Problem'
          icon={<CiSquarePlus className='w-6 h-7 relative text-white' />}
        />
      </div>
      <CustomTable
        problems={problems}
        currentProblems={currentProblems}
        selectedProblems={selectedProblems}
        handleSelectAll={handleSelectAll}
        handleSelect={handleSelect}
        handleSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <Pagination
        currentPage={currentPage}
        totalItems={filteredProblems.length}
        itemsPerPage={itemsPerPage}
        paginate={paginate}
      />
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
