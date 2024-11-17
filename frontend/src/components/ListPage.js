import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for v6
import { FaArrowLeft } from 'react-icons/fa'; // Importing an icon
import "../styles/ListPage.css";

const ListPage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate for v6

  const fetchLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token is missing.');

      const response = await axios.get('http://localhost:5000/api/lists', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists(response.data.lists || []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (listId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to delete a list.');

    try {
      const response = await axios.delete(`http://localhost:5000/api/lists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists(lists.filter((list) => list._id !== listId));
    } catch (err) {
      alert('Failed to delete list.');
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Handle back icon click - navigate to /search
  const handleBackIconClick = () => {
    navigate('/search');
  };

  return (
    <div className="list-page">
      <h1>Your Saved Image Lists</h1>
      {loading && <p>Loading lists...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {lists.length > 0 ? (
        <ul>
          {lists.map((list) => (
            <li key={list._id}>
              <h3>{list.name}</h3>
              <ul>
                {list.images.map((image, index) => (
                  <li key={index}>
                    <img src={image.url} alt={`Image ${index + 1}`} />
                  </li>
                ))}
              </ul>
              <button onClick={() => deleteList(list._id)}>Delete List</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No lists saved yet.</p>
      )}
      <div className="back-icon" onClick={handleBackIconClick}>
        <FaArrowLeft size={30} /> {/* Left arrow icon */}
      </div>
    </div>
  );
};

export default ListPage;
