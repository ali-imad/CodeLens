import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StudentState } from '../pages/AllStudentsViewPage';

interface Problem {
  _id: string;
  title: string;
}

interface AssignProblemModalProps {
  onClose: () => void;
  onAssign: (problemIds: string[], studentIds: string[]) => void;
  students: StudentState[];
}

const AssignProblemModal: React.FC<AssignProblemModalProps> = ({
  onClose,
  onAssign,
  students,
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<Set<string>>(
    new Set(),
  );
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/problems');
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, []);

  const handleProblemSelect = (id: string) => {
    const newSelectedProblems = new Set(selectedProblems);
    if (newSelectedProblems.has(id)) {
      newSelectedProblems.delete(id);
    } else {
      newSelectedProblems.add(id);
    }
    setSelectedProblems(newSelectedProblems);
  };

  const handleStudentSelect = (id: string) => {
    const newSelectedStudents = new Set(selectedStudents);
    if (newSelectedStudents.has(id)) {
      newSelectedStudents.delete(id);
    } else {
      newSelectedStudents.add(id);
    }
    setSelectedStudents(newSelectedStudents);
  };

  const handleAssign = () => {
    onAssign(Array.from(selectedProblems), Array.from(selectedStudents));
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <div className='mt-2 max-h-60 overflow-y-auto'>
          <h4 className='font-medium mb-2'>Select Problems To Be Assigned:</h4>
          {problems.map(problem => (
            <div key={problem._id} className='flex items-center mb-2'>
              <input
                type='checkbox'
                id={`problem-${problem._id}`}
                checked={selectedProblems.has(problem._id)}
                onChange={() => handleProblemSelect(problem._id)}
                className='mr-2'
              />
              <label htmlFor={`problem-${problem._id}`}>{problem.title}</label>
            </div>
          ))}
        </div>
        <div className='mt-4 max-h-60 overflow-y-auto'>
          <h4 className='font-medium mb-2'>
            Select Students To Be Assigned to:
          </h4>
          {students.map(student => (
            <div key={student._id} className='flex items-center mb-2'>
              <input
                type='checkbox'
                id={`student-${student._id}`}
                checked={selectedStudents.has(student._id)}
                onChange={() => handleStudentSelect(student._id)}
                className='mr-2'
              />
              <label
                htmlFor={`student-${student._id}`}
              >{`${student.firstName} ${student.lastName}`}</label>
            </div>
          ))}
        </div>
        <div className='flex justify-end mt-4'>
          <button
            onClick={onClose}
            className='mr-2 px-4 py-2 bg-gray-300 rounded'
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className='px-4 py-2 bg-blue-500 text-white rounded'
            disabled={
              selectedProblems.size === 0 || selectedStudents.size === 0
            }
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignProblemModal;
