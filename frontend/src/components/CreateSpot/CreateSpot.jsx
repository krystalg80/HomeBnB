import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './CreateSpot.css';

function CreateSpot() {
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const { closeModal } = useModal();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf/restore', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          console.log('CSRF Token Data:', data); // Debugging
          setCsrfToken(data['XSRF-Token']); // Adjust to match the backend response
        } else {
          console.error('Failed to fetch CSRF token:', response.status);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);  // Empty dependency array to run only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const token = localStorage.getItem('token');  // Get JWT token from localStorage

    try {
      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token
          'X-XSRF-TOKEN': csrfToken,         // Include CSRF token
        },
        body: JSON.stringify({
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create spot');
      }

      const newSpot = await response.json();
      navigate(`/spots/${newSpot.id}`);
      closeModal(); // Close the modal after creating the spot
    } catch (err) {
      console.error('Error creating spot:', err);
      setErrors({ general: err.message });
    }
  };

  const isButtonDisabled = !address || !city || !state || !country || !lat || !lng || !name || !description || !price;

  return (
    <div className="create-spot-container">
      <form onSubmit={handleSubmit} className="create-spot-form">
        <h2>Create a New Spot</h2>
        {errors.general && <p className="error-text">{errors.general}</p>}
        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Latitude
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        <label>
          Longitude
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="create-spot-button" disabled={isButtonDisabled}>Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpot;