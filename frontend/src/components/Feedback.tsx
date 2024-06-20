import React from "react";
import { TestCaseResult } from "../../../backend/src/services/testCase";

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
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Generated Code</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {generatedCode}
        </pre>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">User Description</h2>
        <p className="whitespace-pre-line">{description}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Test Case Results</h2>
        <div className="divide-y divide-gray-300">
          {feedback.map((result, index) => (
            <div key={index} className="py-4">
              <div className="flex justify-between mb-2">
                <div className="font-semibold">Input:</div>
                <div>{JSON.stringify(result.input)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-semibold">Expected Output:</div>
                <div>{JSON.stringify(result.expectedOutput)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-semibold">Actual Output:</div>
                <div>{JSON.stringify(result.actualOutput)}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Passed:</div>
                <div>{result.passed ? "Yes" : "No"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Overall Result</h2>
        <div
          className={`text-lg font-semibold ${
            isPassed ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPassed ? "Passed" : "Failed"}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
