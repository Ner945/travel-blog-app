import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_USERS = 'http://localhost:5000/api/users';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_USERS}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
  
      if (res.ok) {
        console.log("Login successful:", data);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log("Redirecting to home...");
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input 
            type="text" 
            name="username" 
            value={loginData.username} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            name="password" 
            value={loginData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
