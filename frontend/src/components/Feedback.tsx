import React from "react";

interface FeedbackProps {
  feedback: string;
}

const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      {feedback}
    </div>
  );
};

export default Feedback;
