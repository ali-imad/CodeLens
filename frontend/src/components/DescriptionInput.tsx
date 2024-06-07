import React, { useState } from "react";

interface DescriptionInputProps {
  onSubmit: (description: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ onSubmit }) => {
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description);
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <textarea
        className="p-2 border border-gray-300 rounded"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the code in plain English..."
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default DescriptionInput;
