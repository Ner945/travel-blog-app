import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to the Travel Blog</h1>
      <nav>
        <ul>
          <li><Link to="/travel-logs">Travel Logs</Link></li>
          <li><Link to="/journey-plans">Journey Plans</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
