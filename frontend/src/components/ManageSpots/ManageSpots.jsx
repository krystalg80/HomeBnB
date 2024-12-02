import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import './ManageSpots.css';

function ManageSpots() {
  const sessionUser = useSelector(state => state.session.user);
  const [spots, setSpots] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf/restore', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data['XSRF-Token']); 
        } else {
          console.error('Failed to fetch CSRF token:', response.status);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Fetch spots for the current user (userID from sessionUser)
  useEffect(() => {
    const fetchUserSpots = async () => {
      if (sessionUser && sessionUser.id) { // Make sure the user is logged in
        try {
          const response = await fetch(`/api/users/${sessionUser.id}/spots`);
          if (response.ok) {
            const data = await response.json();
            setSpots(data.spots); // Set the spots in the state
          } else {
            console.error('Failed to fetch user spots:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user spots:', error);
        }
      } else {
        console.error('User ID is not available');
      }
    };

    fetchUserSpots(); // Call the function to fetch the spots
  }, [sessionUser]); // Re-run this whenever sessionUser changes

  // Handle the delete action for a spot
  const handleDelete = async (spotId) => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage

    try {
      const response = await fetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token
          'X-XSRF-TOKEN': csrfToken, // Include CSRF token for protection
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete spot');
      }

      setSpots(spots.filter(spot => spot.id !== spotId)); // Update the state to remove the deleted spot
    } catch (err) {
      console.error('Error deleting spot:', err);
    }
  };

  return (
    <div className="manage-spots-container">
      <h2>Manage Your Spots</h2>
      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot.id} className="spot-item">
            <div className="spot-image-container">
              <img src={spot.previewImage} alt={spot.name} className="spot-image" />
            </div>
            <div className="spot-info">
              <h3>{spot.name}</h3>
              <p>{spot.city}, {spot.state}</p>
              <p>${spot.price}/night</p>
            </div>
            <div className="spot-actions">
              <Link to={`edit/${spot.id}`} className="edit-button">Edit</Link>
              <button onClick={() => handleDelete(spot.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Outlet /> {/* Render child routes here */}
    </div>
  );
}

export default ManageSpots;
