import React, { useState, useEffect } from 'react';

const API_TRAVEL_LOGS = 'http://localhost:5000/api/travel-logs';

const TravelLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    post_date: '',
    tags: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(API_TRAVEL_LOGS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error(`Error fetching travel logs: ${res.status}`);
        setError("Failed to fetch travel logs. Please try again.");
        return;
      }

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching travel logs:", err);
      setError("An error occurred while fetching travel logs.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_TRAVEL_LOGS}/${editingId}` : API_TRAVEL_LOGS;

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim())
        })
      });

      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          post_date: '',
          tags: ''
        });
        setEditingId(null);
        fetchLogs();
      } else {
        console.error("Error submitting travel log.");
        setError("Failed to submit travel log. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting travel log:", err);
      setError("An error occurred while submitting the travel log.");
    }
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setFormData({
      title: log.title,
      description: log.description,
      start_date: log.start_date,
      end_date: log.end_date,
      post_date: log.post_date,
      tags: Array.isArray(log.tags) ? log.tags.join(', ') : log.tags
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(`${API_TRAVEL_LOGS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchLogs();
      } else {
        console.error("Error deleting travel log.");
        setError("Failed to delete travel log. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting travel log:", err);
      setError("An error occurred while deleting the travel log.");
    }
  };

  return (
    <div className="container">
      <h2>Travel Logs</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          name="title" 
          placeholder="Title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
        <textarea 
          name="description" 
          placeholder="Description" 
          value={formData.description} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="start_date" 
          value={formData.start_date} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="end_date" 
          value={formData.end_date} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="post_date" 
          value={formData.post_date} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="tags" 
          placeholder="Tags (comma separated)" 
          value={formData.tags} 
          onChange={handleChange} 
        />
        <button type="submit">{editingId ? 'Update Log' : 'Add Log'}</button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                start_date: '',
                end_date: '',
                post_date: '',
                tags: ''
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Post Date</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.title}</td>
              <td>{log.description}</td>
              <td>{log.start_date}</td>
              <td>{log.end_date}</td>
              <td>{log.post_date}</td>
              <td>{Array.isArray(log.tags) ? log.tags.join(', ') : log.tags}</td>
              <td>
                <button onClick={() => handleEdit(log)}>Edit</button>
                <button onClick={() => handleDelete(log.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan="8">No travel logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TravelLogsPage;
