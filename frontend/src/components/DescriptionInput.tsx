import React, { useState } from 'react';
import Spinner from '../utility/Spinner';
interface DescriptionInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description);
    setDescription('');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
        <textarea
          className='p-2 border border-gray-300 rounded'
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Describe the code in plain English...'
        />
        <button
          type='submit'
          className={`p-2 rounded transition-colors duration-200 ease-in-out ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          }`}
          disabled={isLoading}
        >
          Submit
        </button>
      </form>
      {isLoading && (
        <div className='flex justify-center'>
          <Spinner />
        </div>
      )}
    </>
  );
};

export default DescriptionInput;
