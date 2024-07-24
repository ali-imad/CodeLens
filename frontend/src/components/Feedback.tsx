import React from 'react';
import axios from 'axios';
import { IAttemptResponse } from './Dashboard.tsx';
import { Verdict } from '../types.tsx';

interface AnnotateButtonProps {
  oc: () => void;
  className?: string;
  isLoading: boolean;
}

const AnnotateButton: React.FC<AnnotateButtonProps> = (
  props: AnnotateButtonProps,
) => {
  return (
    <button
      onClick={props.oc}
      disabled={props.isLoading}
      className={`
        ${
          props.isLoading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-yellow-300 hover:bg-yellow-400'
        }
        text-gray-800
        font-medium 
        outline-gray-800
        py-2 px-4 
        rounded-full 
        transition duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 
        text-sm
        ${props.className || ''}
      `}
    >
      Annotate
    </button>
  );
};

interface FeedbackProps extends IAttemptResponse {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const Feedback: React.FC<FeedbackProps> = (props: FeedbackProps) => {
  // Extract props
  const { _id, generatedCode, description, feedback, isPassed } = props.attempt;
  const { isLoading, setIsLoading } = props;
  const history = props.history;

  const [isAnnotated, setIsAnnotated] = React.useState<boolean>(false);
  const [annotatedCode, setAnnotatedCode] = React.useState<string>('');
  const [code, setCode] = React.useState<string>(generatedCode);

  const handleAnnotateFeedback = async (_id: string) => {
    if (isAnnotated) {
      setCode(generatedCode);
    } else {
      if (!annotatedCode) {
        setIsLoading(true);
        try {
          const response = await axios.post(
            `http://localhost:3000/attempts/${_id}/annotate`,
            { history },
          );
          setCode(response.data.response);
          setAnnotatedCode(response.data.response);
          setIsLoading(false);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error('Error annotating feedback:', error.message);
        }
      } else {
        setCode(annotatedCode);
      }
    }
    setIsAnnotated(!isAnnotated);
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6 space-y-6'>
      <div>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold mb-4'>
            Generated Code Based on User Input
          </h2>
          <AnnotateButton
            isLoading={isLoading}
            oc={() => handleAnnotateFeedback(_id)}
          />
        </div>
        <pre className='bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-xs'>
          {code}
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
                    result.passed === Verdict.Passed
                      ? 'text-green-600'
                      : result.passed === Verdict.Error
                        ? 'text-pink-400'
                        : 'text-red-600'
                  }`}
                >
                  {result.passed === Verdict.Passed
                    ? 'Yes'
                    : result.passed === Verdict.Error
                      ? 'Error'
                      : 'No'}
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
            isPassed === Verdict.Passed
              ? 'text-green-600'
              : isPassed === Verdict.Error
                ? 'text-pink-400'
                : 'text-red-600'
          }`}
        >
          {isPassed === Verdict.Passed
            ? 'Accepted'
            : isPassed === Verdict.Error
              ? 'Invalid Attempt'
              : 'Failed'}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
