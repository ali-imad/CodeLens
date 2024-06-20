import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import ProblemDescription from "../pages/ProblemDescription";
import DescriptionInput from "./DescriptionInput";
import Feedback from "./Feedback";
import { IProblem } from "../../../backend/src/models/Problem";

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");

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

  const handleDescriptionSubmit = (description: string) => {
    const simulatedFeedback = `Your description: "${description}" was received and processed.`;
    setFeedback(simulatedFeedback);
  };

  return (
    <div className="p-6 space-y-6">
      <ProblemDescription problem={problem} />
      <DescriptionInput onSubmit={handleDescriptionSubmit} />
      {feedback && <Feedback feedback={feedback} />}
    </div>
  );
};

export default Dashboard;
