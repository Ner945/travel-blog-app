import React, { useState, useEffect } from 'react';

const API_JOURNEY_PLANS = 'http://localhost:5000/api/journey-plans';

const JourneyPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    journey_plan_name: '',
    journey_plan_locations: '',
    start_date: '',
    end_date: '',
    list_of_activities: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchPlans = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(API_JOURNEY_PLANS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error(`Error fetching journey plans: ${res.status}`);
        setError("Failed to fetch journey plans. Please try again.");
        return;
      }

      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error("Error fetching journey plans:", err);
      setError("An error occurred while fetching journey plans.");
    }
  };

  useEffect(() => {
    fetchPlans();
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
    const url = editingId ? `${API_JOURNEY_PLANS}/${editingId}` : API_JOURNEY_PLANS;

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
          journey_plan_locations: formData.journey_plan_locations.split(',').map(location => location.trim()),
          list_of_activities: formData.list_of_activities.split(',').map(activity => activity.trim())
        })
      });

      if (res.ok) {
        setFormData({
          journey_plan_name: '',
          journey_plan_locations: '',
          start_date: '',
          end_date: '',
          list_of_activities: '',
          description: ''
        });
        setEditingId(null);
        fetchPlans();
      } else {
        console.error("Error submitting journey plan.");
        setError("Failed to submit journey plan. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting journey plan:", err);
      setError("An error occurred while submitting the journey plan.");
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setFormData({
      journey_plan_name: plan.journey_plan_name,
      journey_plan_locations: Array.isArray(plan.journey_plan_locations) 
        ? plan.journey_plan_locations.join(', ') 
        : plan.journey_plan_locations,
      start_date: plan.start_date,
      end_date: plan.end_date,
      list_of_activities: Array.isArray(plan.list_of_activities) 
        ? plan.list_of_activities.join(', ') 
        : plan.list_of_activities,
      description: plan.description
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(`${API_JOURNEY_PLANS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchPlans();
      } else {
        console.error("Error deleting journey plan.");
        setError("Failed to delete journey plan. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting journey plan:", err);
      setError("An error occurred while deleting the journey plan.");
    }
  };

  return (
    <div className="container">
      <h2>Journey Plans</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          name="journey_plan_name" 
          placeholder="Plan Name" 
          value={formData.journey_plan_name} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="journey_plan_locations" 
          placeholder="Locations (comma separated)" 
          value={formData.journey_plan_locations} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="start_date" 
          placeholder="Start Date" 
          value={formData.start_date} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="end_date" 
          placeholder="End Date" 
          value={formData.end_date} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="list_of_activities" 
          placeholder="Activities (comma separated)" 
          value={formData.list_of_activities} 
          onChange={handleChange} 
        />
        <textarea 
          name="description" 
          placeholder="Description" 
          value={formData.description} 
          onChange={handleChange} 
        ></textarea>
        <button type="submit">{editingId ? 'Update Plan' : 'Add Plan'}</button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setEditingId(null);
              setFormData({
                journey_plan_name: '',
                journey_plan_locations: '',
                start_date: '',
                end_date: '',
                list_of_activities: '',
                description: ''
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
            <th>Plan Name</th>
            <th>Locations</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Activities</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.journey_plan_name}</td>
              <td>{Array.isArray(plan.journey_plan_locations) ? plan.journey_plan_locations.join(', ') : plan.journey_plan_locations}</td>
              <td>{plan.start_date}</td>
              <td>{plan.end_date}</td>
              <td>{Array.isArray(plan.list_of_activities) ? plan.list_of_activities.join(', ') : plan.list_of_activities}</td>
              <td>{plan.description}</td>
              <td>
                <button onClick={() => handleEdit(plan)}>Edit</button>
                <button onClick={() => handleDelete(plan.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {plans.length === 0 && (
            <tr>
              <td colSpan="8">No journey plans available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JourneyPlansPage;
