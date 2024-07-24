import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import ProblemDescription from '../pages/ProblemDescription';
import DescriptionInput from './DescriptionInput';
import Feedback from './Feedback';
import {
  Difficulty,
  ITestCase,
  ProblemStatus,
  TestCaseResult,
  Verdict,
} from '../types';
import ProblemStatusIcon from './ProblemStatusIcon';

export interface IProblem extends Document {
  title: string;
  difficulty: Difficulty;
  functionBody: string;
  testCases: ITestCase[];
  hints: string[];
}

interface IAttempt {
  _id: string;
  generatedCode: string;
  description: string;
  feedback: TestCaseResult[];
  isPassed: Verdict;
}

interface NotificationProps {
  message: string | undefined;
}

const ErrorNotification: React.FC<NotificationProps> = ({ message }) => {
  return (
    <div className='bg-red-100 border-l-4 border-red-500 text-red-800 p-4 flex items-center shadow-md'>
      <Bell className='h-6 w-6 mr-4' />
      <span>{message}</span>
    </div>
  );
};

const HintNotification: React.FC<NotificationProps> = ({ message }) => {
  return (
    <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-center shadow-md'>
      <Bell className='h-6 w-6 mr-4' />
      <span>{message}</span>
    </div>
  );
};

interface ILLMHistory {
  role: string;
  content: string;
}

export interface IAttemptResponse {
  attempt: IAttempt;
  history: ILLMHistory[];
}

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attemptResponse, setAttemptResponse] =
    useState<IAttemptResponse | null>(null);
  const [numAttempts, setNumAttempts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [problemStatus, setProblemStatus] = useState<ProblemStatus>(
    ProblemStatus.NotAttempted,
  );

  const fetchProblemStatus = async (
    userId: string | undefined,
    problemId: string | undefined,
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/problems/status/${userId}`,
      );
      const problemStatuses = response.data;
      for (const problemStatus of problemStatuses) {
        if (problemStatus._id === problemId) {
          setProblemStatus(problemStatus.status);
          return // early return out
        }
      }
      // If the problem is not found, set the status to NotAttempted
      setProblemStatus(ProblemStatus.NotAttempted);
    } catch (err) {
      console.error('Error fetching problem status:', err);
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response: AxiosResponse<IProblem> = await axios.get(
          `http://localhost:3000/problems/${id}`,
        );
        setProblem(response.data);
        setError(null);
        setNumAttempts(0);

        const userEmail = localStorage.getItem('email');
        const userResponse = await axios.get(
          `http://localhost:3000/email/${userEmail}`,
        );
        const userId = userResponse.data._id;

        const status = await fetchProblemStatus(userId, id);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || err.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    if (id) {
      setAttemptResponse(null);
      fetchProblem();
    }
  }, [id]);

  const handleDescriptionSubmit = async (description: string) => {
    if (problem === null) {
      return;
    }
    if (attemptResponse) {
      setAttemptResponse(null);
    }
    setIsLoading(true);
    try {
      const userEmail = localStorage.getItem('email');
      const userResponse = await axios.get(
        `http://localhost:3000/email/${userEmail}`,
      );
      const userId = userResponse.data._id;

      const response: AxiosResponse<IAttemptResponse> = await axios.post(
        `http://localhost:3000/attempts`,
        {
          problemId: id,
          userId,
          description,
        },
      );

      if (!response.data || !response.data.attempt) {
        throw new Error('could not query LLM');
      }
      setAttemptResponse(response.data);
      if (numAttempts < problem.hints.length) {
        setNumAttempts(numAttempts + 1);
      }

      if (response.data.attempt.isPassed === Verdict.Passed) {
        setProblemStatus(ProblemStatus.Completed);
      } else if (response.data.attempt.isPassed === Verdict.Error) {
        setProblemStatus(ProblemStatus.Error);
      } else if (response.data.attempt.isPassed === Verdict.Failed && problemStatus !== ProblemStatus.Completed) {
        setProblemStatus(ProblemStatus.Attempted);
      }
    } catch (err) {
      console.error('Error submitting description:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div className='flex h-screen'>
      <div className='flex flex-col w-1/2 p-4 border-r border-gray-200 overflow-y-auto'>
        <div className='flex justify-end items-center mb-4'>
          <ProblemStatusIcon status={problemStatus} />
        </div>

        {/* check if the problem is not completed and its hints exist before rendering */}
        {problemStatus === ProblemStatus.Attempted ? (
          problem.hints
            .slice(0, numAttempts)
            .map((hint: string, index: number) => (
              <HintNotification key={index} message={hint} />
            ))
        ) : problemStatus === ProblemStatus.Error ? (
          <ErrorNotification
            message='An error occurred while running generated code. To prevent this, please assess the generated input and be more specific in your prompt.' />
        ) : null}
        <ProblemDescription problem={problem} />
        <DescriptionInput
          onSubmit={handleDescriptionSubmit}
          isLoading={isLoading}
        />
      </div>

      <div className='flex flex-col w-1/2 p-4 overflow-y-auto'>
        {attemptResponse && (
          <Feedback
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            {...attemptResponse}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
