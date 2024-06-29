import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Instructor {
  _id: string;
  username: string;
}

const SelectInstructorPage: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/email/${email}`,
        );

        if (response.data._id) {
          setUserId(response.data._id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchEmail = () => {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    fetchEmail();
    fetchUserData();
  }, [email]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get<Instructor[]>(
          'http://localhost:3000/users/instructors',
        );
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    };

    fetchInstructors();
  }, []);

  const handleSelectInstructor = (instructorId: string) => {
    setSelectedInstructor(instructorId);
  };

  const handleSubmit = async () => {
    if (!userId || !selectedInstructor) {
      console.error('User ID or selected instructor ID is missing.');
      return;
    }

    try {
      await axios.put('http://localhost:3000/users/select-instructor', {
        userId,
        instructorId: selectedInstructor,
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error selecting instructor:', error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <div className='container mx-auto p-4'>
        <div className='flex justify-between items-center mb-4'>
          <button
            onClick={handleBackToHome}
            className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md'
          >
            Back to Home
          </button>
          <h1 className='text-3xl font-bold text-center flex-1'>
            Select Your Instructor
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {instructors.map(instructor => (
            <div
              key={instructor._id}
              className={`bg-white p-4 rounded-lg shadow-md cursor-pointer ${
                selectedInstructor === instructor._id
                  ? 'border-2 border-blue-500'
                  : ''
              }`}
              onClick={() => handleSelectInstructor(instructor._id)}
            >
              <div className='flex justify-between items-center mb-2'>
                <span className='text-lg font-semibold'>
                  {instructor.username}
                </span>
                {selectedInstructor === instructor._id && (
                  <span className='bg-blue-500 text-white py-1 px-2 rounded-md'>
                    Selected
                  </span>
                )}
              </div>
              <div className='text-sm text-gray-500'>Click to select</div>
            </div>
          ))}
        </div>
        <div className='flex justify-center mt-16'>
          <button
            onClick={handleSubmit}
            className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md inline-block'
          >
            Confirm Selection
          </button>
        </div>
        {showSuccess && (
          <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75'>
            <div className='bg-white p-6 rounded-lg shadow-lg text-center'>
              <p className='text-green-600 text-lg font-bold mb-4'>
                Instructor assigned successfully!
              </p>
              <button
                onClick={handleSuccessClose}
                className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInstructorPage;
