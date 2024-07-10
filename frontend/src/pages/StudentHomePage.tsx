import React from 'react';
import { Link } from 'react-router-dom';

const StudentHomePage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4'>
          Code Comprehension Tutor
        </h1>
        <p className='text-xl md:text-2xl mb-8'>
          Enhance Your Code Comprehension Skills
        </p>
        <p className='text-gray-400 mb-12 max-w-2xl mx-auto'>
          Welcome to the CodeLens! Improve your understanding of JavaScript by
          describing code snippets and testing your comprehension against
          generated solutions.
        </p>
        <div className='flex space-x-8 justify-center'>
          <Link
            to='/select-instructor'
            className='px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out shadow-md'
          >
            FIND YOUR INSTRUCTOR
          </Link>
          <Link
            to='/problems'
            className='px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 ease-in-out shadow-md'
          >
            START LEARNING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
