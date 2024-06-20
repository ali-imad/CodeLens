import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import ProblemDescription from "../pages/ProblemDescription";
import DescriptionInput from "./DescriptionInput";
import Feedback from "./Feedback";
import { IProblem } from "../../../backend/src/models/Problem";
import { TestCaseResult } from "../../../backend/src/services/testCase";

interface IAttemptResponse {
  generatedCode: string;
  feedback: TestCaseResult[];
  isPassed: boolean;
  description: string;
}

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attemptResponse, setAttemptResponse] =
    useState<IAttemptResponse | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response: AxiosResponse<IProblem> = await axios.get(
          `http://localhost:3000/problems/${id}`
        );
        setProblem(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }

  const handleDescriptionSubmit = async (description: string) => {
    try {
      const userEmail = localStorage.getItem("email");
      const userResponse = await axios.get(
        `http://localhost:3000/email/${userEmail}`
      );
      const userId = userResponse.data._id;

      const response: AxiosResponse<IAttemptResponse> = await axios.post(
        `http://localhost:3000/attempts`,
        {
          problemId: id,
          userId,
          description,
        }
      );
      setAttemptResponse(response.data);
    } catch (err) {
      console.error("Error submitting description:", err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <ProblemDescription problem={problem} />
      <DescriptionInput onSubmit={handleDescriptionSubmit} />
      {attemptResponse && (
        <Feedback
          description={attemptResponse.description}
          feedback={attemptResponse.feedback}
          isPassed={attemptResponse.isPassed}
          generatedCode={attemptResponse.generatedCode}
        />
      )}
    </div>
  );
};

export default Dashboard;
