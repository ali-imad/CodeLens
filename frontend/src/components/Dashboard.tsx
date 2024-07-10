import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import ProblemDescription from '../pages/ProblemDescription';
import DescriptionInput from './DescriptionInput';
import Feedback from './Feedback';
import { Difficulty, ITestCase, TestCaseResult } from '../types';
import { ProblemStatus } from '../types';
import ProblemStatusIcon from './ProblemStatusIcon';

export interface IProblem extends Document {
  title: string;
  difficulty: Difficulty;
  functionBody: string;
  testCases: ITestCase[];
}

interface IAttempt {
  _id: string;
  generatedCode: string;
  feedback: TestCaseResult[];
  isPassed: boolean;
  description: string;
}

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
      const currentProblemStatus = problemStatuses.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => p.id === problemId,
      );
      if (currentProblemStatus) {
        setProblemStatus(currentProblemStatus.status);
      }
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

        const userEmail = localStorage.getItem('email');
        const userResponse = await axios.get(
          `http://localhost:3000/email/${userEmail}`,
        );
        const userId = userResponse.data._id;

        await fetchProblemStatus(userId, id);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || err.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    if (id) {
      fetchProblem();
      setAttemptResponse(null);
    }
  }, [id]);

  const handleDescriptionSubmit = async (description: string) => {
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

      if (response.data.attempt.isPassed) {
        setProblemStatus(ProblemStatus.Completed);
      } else if (problemStatus === 'Not Attempted') {
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
