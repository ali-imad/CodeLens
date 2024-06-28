import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProblemsPage from './pages/ProblemsPage';
import StudentHomePage from './pages/StudentHomePage';
import NotLoggedInPage from './pages/NotLoggedInPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminHomePage from './pages/AdminHomePage';
import SelectInstructorPage from './pages/SelectInstructorPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem('email') ? true : false,
  );
  const [username, setUsername] = useState<string>(
    localStorage.getItem('username') || '',
  );

  const [role, setRole] = useState<string>(
    localStorage.getItem('role') || 'Student',
  );

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    setRole(localStorage.getItem('role') || 'Student');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('Student');
    setUsername('');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <div className='min-h-screen bg-gray-100'>
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
        />
        <div>
          {isLoggedIn ? (
            <Routes>
              {role === 'Instructor' && (
                <Route path='/' element={<AdminHomePage />} />
              )}
              {role === 'Student' && (
                <Route path='/' element={<StudentHomePage />} />
              )}
              {role === 'Student' && (
                <Route
                  path='/select-instructor'
                  element={<SelectInstructorPage />}
                />
              )}
              <Route path='/problems' element={<ProblemsPage />} />
              <Route path='/problems/:id' element={<Dashboard />} />
              {role === 'Student' && (
                <Route path='/dashboard' element={<Dashboard />} />
              )}
              {/* Redirect to homepage when logged in */}
              <Route path='/login' element={<Navigate to='/' replace />} />
              <Route path='/register' element={<Navigate to='/' replace />} />
            </Routes>
          ) : (
            <Routes>
              <Route path='/' element={<NotLoggedInPage />} />
              <Route path='/problems' element={<NotLoggedInPage />} />
              <Route path='/problems/:id' element={<NotLoggedInPage />} />
              <Route
                path='/login'
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path='/register'
                element={
                  <RegistrationPage onLoginSuccess={handleLoginSuccess} />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
