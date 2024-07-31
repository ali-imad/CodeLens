import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PolicyPopup from '../components/PolicyPopup';

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  consent: boolean;
}

interface RegistrationPageProps {
  onLoginSuccess: (username: string) => void;
}

const imageUrl = 'http://localhost:3000/avatar.jpg';

const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onLoginSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Student',
    consent: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/register',
        formData,
      );
      if (response.status === 201) {
        // upload the default image for user on successful registration
        const imageFileBlob = await fetch(imageUrl).then(response =>
          response.blob(),
        );
        const formDatawithDefaultImage = new FormData();
        formDatawithDefaultImage.append('username', formData.username);
        formDatawithDefaultImage.append('image', imageFileBlob);
        const res = await axios.post(
          `http://localhost:3000/users/${formData.username}/uploadImage`,
          formDatawithDefaultImage,
        );
        if (res.status === 200) {
          localStorage.setItem('profileImage', imageUrl);
        }

        localStorage.setItem('email', response.data.email);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);
        localStorage.setItem('role', formData.role);
        onLoginSuccess(formData.username);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(
            error.response.data.error || 'An error occurred. Please try again.',
          );
        } else {
          setErrorMessage('Network error. Please check your connection.');
        }
      } else {
        setErrorMessage('Unexpected error. Please try again.');
      }
    }
  };

  return (
    <div className='mt-36 flex flex-col items-center'>
      <h2>Welcome to CodeLens! Please register below.</h2>
      <br />
      <form onSubmit={handleSubmit} className='max-w-sm mx-auto'>
        {errorMessage && (
          <div className='mb-4 p-2 text-red-700 border border-red-700 rounded'>
            {errorMessage}
          </div>
        )}
        <input
          type='text'
          name='username'
          value={formData.username}
          onChange={handleChange}
          placeholder='Username'
          className='w-full mb-2 p-2 border rounded'
          required
        />
        <input
          type='text'
          name='firstName'
          value={formData.firstName}
          onChange={handleChange}
          placeholder='First Name'
          className='w-full mb-2 p-2 border rounded'
          required
        />
        <input
          type='text'
          name='lastName'
          value={formData.lastName}
          onChange={handleChange}
          placeholder='Last Name'
          className='w-full mb-2 p-2 border rounded'
          required
        />
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Email'
          className='w-full mb-2 p-2 border rounded'
          required
        />
        <input
          type='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Password'
          className='w-full mb-2 p-2 border rounded'
          required
        />
        <select
          name='role'
          value={formData.role}
          onChange={handleChange}
          className='w-full mb-4 p-2 border rounded'
          required
        >
          <option value='Student'>Student</option>
          <option value='Instructor'>Instructor</option>
        </select>
        <div className='flex items-center mb-4 mt-2'>
          <input
            type='checkbox'
            name='consent'
            id='consent'
            checked={formData.consent}
            onChange={handleChange}
            className='mr-2'
            required
          />
          <label htmlFor='consent'>
            By registering, you acknowledge that you agree to Codelens's{' '}
            <span
              className='text-blue-500 hover:underline cursor-pointer'
              onClick={() => setShowPrivacyPolicy(true)}
            >
              Privacy Statement.
            </span>
          </label>
        </div>
        <button
          type='submit'
          className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700'
        >
          Register
        </button>
      </form>
      <div className='mt-4'>
        <p>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500 hover:underline'>
            Login here
          </Link>
        </p>
      </div>
      {showPrivacyPolicy && (
        <PolicyPopup onClose={() => setShowPrivacyPolicy(false)} />
      )}
    </div>
  );
};

export default RegistrationPage;
