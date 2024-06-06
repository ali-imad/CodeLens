import React, { useEffect, useState } from "react";
import CodeSampleCard from "./components/CodeSampleCard";
import { CodeSample } from "./types";

const App: React.FC = () => {
  const [codeSamples, setCodeSamples] = useState<CodeSample[]>([]);

  useEffect(() => {
    const mockData: CodeSample[] = [
      {
        id: "1",
        code: "function add(a, b) { return a + b; }",
        description: "Adds two numbers",
      },
      {
        id: "2",
        code: "function subtract(a, b) { return a - b; }",
        description: "Subtracts two numbers",
      },
      {
        id: "3",
        code: "function multiply(a, b) { return a * b; }",
        description: "Multiplies two numbers",
      },
      {
        id: "4",
        code: "function divide(a, b) { return a / b; }",
        description: "Divides two numbers",
      },
    ];

    setCodeSamples(mockData);
  }, []);

  return (
    <div className="flex justify-center h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">
          CodeLens Frontend
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {codeSamples.map((codeSample) => (
            <CodeSampleCard key={codeSample.id} codeSample={codeSample} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
