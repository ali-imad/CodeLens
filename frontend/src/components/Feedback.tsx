import React from 'react';
import { TestCaseResult } from '../../../backend/src/services/testCase';

interface FeedbackProps {
  generatedCode: string;
  description: string;
  feedback: TestCaseResult[];
  isPassed: boolean;
}

const Feedback: React.FC<FeedbackProps> = ({
  generatedCode,
  description,
  feedback,
  isPassed,
}) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-6 space-y-6'>
      <div>
        <h2 className='text-xl font-bold mb-4'>
          Generated Code Based on User Input
        </h2>
        <pre className='bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap'>
          {generatedCode}
        </pre>
      </div>

      <div>
        <h2 className='text-xl font-bold mb-4'>User Description</h2>
        <p className='bg-gray-100 p-4 rounded-lg whitespace-pre-line'>
          {description}
        </p>
      </div>

      <div>
        <h2 className='text-xl font-bold mb-4'>Test Case Results</h2>
        <div className='space-y-4'>
          {feedback.map((result, index) => (
            <div
              key={index}
              className='p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200'
            >
              <div className='mb-2'>
                <h3 className='font-semibold'>Test Case {index + 1}</h3>
              </div>

              <div className='mb-2'>
                <span className='font-semibold'>Input: </span>
                <span className='bg-gray-200 rounded-md px-2 py-1'>
                  {JSON.stringify(result.input)}
                </span>
              </div>

              <div className='mb-2'>
                <span className='font-semibold'>Expected Output: </span>
                <span className='bg-gray-200 rounded-md px-2 py-1'>
                  {JSON.stringify(result.expectedOutput)}
                </span>
              </div>

              <div className='mb-2'>
                <span className='font-semibold'>Actual Output: </span>
                <span className='bg-gray-200 rounded-md px-2 py-1'>
                  {JSON.stringify(result.actualOutput)}
                </span>
              </div>

              <div>
                <span className='font-semibold'>Passed: </span>
                <span
                  className={`font-bold ${
                    result.passed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {result.passed ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-xl font-bold mb-2'>Overall Result</h2>
        <div
          className={`text-lg font-semibold ${
            isPassed ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPassed ? 'Accepted' : 'Failed'}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
