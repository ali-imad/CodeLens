import React from "react";
import { useParams } from "react-router-dom";
import ProblemDescription from "./ProblemDescription";
import DescriptionInput from "./DescriptionInput";
import Feedback from "./Feedback";
import mockProblems from "../mockProblems";

const Dashboard: React.FC = () => {
  const { id } = useParams();
  const problemId = parseInt(id || "1");
  const problem = mockProblems.find((prob) => prob.id === problemId);

  const [feedback, setFeedback] = React.useState("");

  if (!problem) {
    return <div>Problem not found</div>;
  }

  const handleDescriptionSubmit = (description: string) => {
    const simulatedFeedback = `Your description: "${description}" was received and processed.`;
    setFeedback(simulatedFeedback);
  };

  return (
    <div className="space-y-6">
      <ProblemDescription problem={problem} />
      <DescriptionInput onSubmit={handleDescriptionSubmit} />
      {feedback && <Feedback feedback={feedback} />}
    </div>
  );
};

export default Dashboard;
