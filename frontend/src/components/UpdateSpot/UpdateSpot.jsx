import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './UpdateSpot.css';

function UpdateSpot() {
  const { spotId } = useParams();
  const navigate = useNavigate();
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
  const [imageUrl, setImageUrl] = useState(''); // New state for image URL
  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf/restore', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
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

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        if (response.ok) {
          const data = await response.json();
          setAddress(data.address || '');
          setCity(data.city || '');
          setState(data.state || '');
          setCountry(data.country || '');
          setLat(data.lat || '');
          setLng(data.lng || '');
          setName(data.name || '');
          setDescription(data.description || '');
          setPrice(data.price || '');
        } else {
          console.error('Failed to fetch spot details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching spot details:', error);
      }
    };

    fetchSpotDetails();
  }, [spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const token = localStorage.getItem('token');  // Get JWT token from localStorage

    try {
      const response = await fetch(`/api/spots/${spotId}`, {
        method: 'PATCH',
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
        throw new Error(errorData.message || 'Failed to update spot');
      }

      // Add image to the spot
      if (imageUrl) {
        const imageResponse = await fetch(`/api/spots/${spotId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include JWT token
            'X-XSRF-TOKEN': csrfToken,         // Include CSRF token
          },
          body: JSON.stringify({
            url: imageUrl,
            preview: true
          }),
        });

        if (!imageResponse.ok) {
          const imageErrorData = await imageResponse.json();
          throw new Error(imageErrorData.message || 'Failed to add image');
        }
      }

      navigate(`/spots/${spotId}`);
      closeModal(); // Close the modal after updating the spot
    } catch (err) {
      console.error('Error updating spot:', err);
      setErrors({ general: err.message });
    }
  };

  const isButtonDisabled = !address || !city || !state || !country || !lat || !lng || !name || !description || !price;

  return (
    <div className="update-spot-container">
      <form onSubmit={handleSubmit} className="update-spot-form">
        <h2>Update Spot</h2>
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
        <label>
          Image URL
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <button type="submit" className="update-spot-button" disabled={isButtonDisabled}>Update Spot</button>
      </form>
    </div>
  );
}

export default UpdateSpot;