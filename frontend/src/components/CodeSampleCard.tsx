import React from "react";
import { CodeSample } from "../types";

interface CodeSampleCardProps {
  codeSample: CodeSample;
}

const CodeSampleCard: React.FC<CodeSampleCardProps> = ({ codeSample }) => {
  return (
    <div className="border border-gray-200 rounded p-4 shadow-md">
      <h2 className="text-xl font-bold mb-2">{codeSample.code}</h2>
      <p className="text-gray-600">{codeSample.description}</p>
    </div>
  );
};

export default CodeSampleCard;
