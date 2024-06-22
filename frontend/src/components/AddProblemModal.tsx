import { useState } from 'react';
import axios from 'axios';
import { Difficulty, ITestCase } from '../../../backend/src/models/Problem';

interface AddProblemModalProps {
  onClose: () => void;
  onProblemAdded: () => void;
}

const AddProblemModal: React.FC<AddProblemModalProps> = ({
  onClose,
  onProblemAdded,
}) => {
  const [title, setTitle] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [functionBody, setFunctionBody] = useState<string>('');
  const [testCases, setTestCases] = useState<ITestCase[]>([
    { input: '', expectedOutput: '' },
  ]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleTestCaseChange = (
    index: number,
    key: keyof ITestCase,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ) => {
    const newTestCases = [...testCases];
    (newTestCases[index] as ITestCase)[key] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/problems', {
        title,
        difficulty,
        functionBody,
        testCases,
      });
      onProblemAdded();
      onClose();
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl'>
        <h2 className='text-2xl font-semibold mb-4'>Add Problem</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Title
            </label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as Difficulty)}
              className='block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
              required
            >
              {Object.values(Difficulty).map(diff => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Function Body
            </label>
            <textarea
              value={functionBody}
              onChange={e => setFunctionBody(e.target.value)}
              className='block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
              rows={4}
              required
            />
          </div>
          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-2'>
              Test Cases
            </h3>
            {testCases.map((testCase, index) => (
              <div key={index} className='flex space-x-2 mb-2'>
                <input
                  type='text'
                  placeholder='Input'
                  value={testCase.input}
                  onChange={e =>
                    handleTestCaseChange(index, 'input', e.target.value)
                  }
                  className='block w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
                  required
                />
                <input
                  type='text'
                  placeholder='Expected Output'
                  value={testCase.expectedOutput}
                  onChange={e =>
                    handleTestCaseChange(
                      index,
                      'expectedOutput',
                      e.target.value,
                    )
                  }
                  className='block w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
                  required
                />
              </div>
            ))}
            <button
              type='button'
              onClick={handleAddTestCase}
              className='text-blue-500 hover:underline'
            >
              + Add Test Case
            </button>
          </div>
          <div className='flex justify-end space-x-4 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblemModal;
