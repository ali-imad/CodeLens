import React, { useEffect, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const rememberMeState = localStorage.getItem('rememberMeState');
    return rememberMeState === 'true';
  });

  useEffect(() => {
    if (rememberMe) {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .post('http://localhost:3000/authToken', {
            token,
          })
          .then(response => {
            setFormData({
              email: response.data.email,
              password: response.data.password,
            });
          })
          .catch(error => {
            console.error('Token validation failed:', error);
            setErrorMessage('Session expired. Re-login required.');
            localStorage.removeItem('token');
            setRememberMe(false);
          });
      } else {
        setRememberMe(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage('');
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
    localStorage.setItem('rememberMeState', String(!rememberMe));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/login',
        formData,
      );
      if (response.status === 200) {
        if (rememberMe) {
          localStorage.setItem('token', response.data.token);
        }
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('firstName', response.data.firstName);
        localStorage.setItem('lastName', response.data.lastName);
        onLoginSuccess(response.data.username);
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
          type={showPassword ? 'text' : 'password'}
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Password'
          className='w-full mb-2 p-2 border rounded'
          required
        />

        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <input
              id='showPassword'
              type='checkbox'
              className='w-5 h-5 round '
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label
              htmlFor='showPassword'
              className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-900'
            >
              Show password
            </label>
          </div>
          <div className='flex items-center'>
            <input
              id='rememberMe'
              type='checkbox'
              checked={rememberMe}
              onChange={handleRememberMe}
              className='w-5 h-5'
            />
            <label
              htmlFor='rememberMe'
              className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-900'
            >
              Remember me
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700'
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
