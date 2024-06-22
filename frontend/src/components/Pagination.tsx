import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  paginate,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
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
        {Array.from({ length: totalPages }, (_, index) => (
          <a
            key={index}
            href='#'
            onClick={() => paginate(index + 1)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              currentPage === index + 1
                ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }`}
          >
            {index + 1}
          </a>
        ))}
        <a
          href='#'
          onClick={() =>
            paginate(currentPage < totalPages ? currentPage + 1 : currentPage)
          }
          className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className='sr-only'>Next</span>
          <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
        </a>
      </nav>
    </div>
  );
};

export default Pagination;
