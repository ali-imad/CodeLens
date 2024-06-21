import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/login',
        formData,
      );
      if (response.status === 200) {
        onLoginSuccess(response.data.username);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('username', response.data.username);
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
    <div className='mt-60 flex flex-col items-center'>
      <h2>Welcome to CodeLens! Please Log in below.</h2>
      <br />
      <form onSubmit={handleSubmit} className='max-w-sm mx-auto'>
        {errorMessage && (
          <div className='mb-4 p-2 text-red-700 border border-red-700 rounded'>
            {errorMessage}
          </div>
        )}
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
        <button
          type='submit'
          className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700'
        >
          Login
        </button>
      </form>
      <div className='mt-4'>
        <p>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-500 hover:underline'>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
