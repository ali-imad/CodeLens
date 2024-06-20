import React from "react";

interface FeedbackProps {
  description: string;
  feedback: string;
  isPassed: boolean;
  generatedCode: string;
}

const Feedback: React.FC<FeedbackProps> = ({
  description,
  feedback,
  isPassed,
  generatedCode,
}) => {
  return (
    <div className="space-y-2">
      <h2 className="font-medium">Feedback:</h2>
      <div className="border border-gray-300 rounded-md p-4">
        <p>{feedback}</p>
        {isPassed ? (
          <p className="text-green-600 font-medium">Test cases passed!</p>
        ) : (
          <>
            <p className="text-red-600 font-medium">Test cases failed.</p>
            <code className="block overflow-x-auto bg-gray-100 p-2 rounded-md">
              {generatedCode}
            </code>
            <p>{description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
