import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SpotDetails.css';

function SpotDetails() {
  const { spotId } = useParams(); // Get spotId from URL params
  const [spot, setSpot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch spot details from the API
    fetch(`/api/spots/${spotId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.spot) {
          setSpot(data.spot); // Update the state with the spot details
        } else {
          setError('Failed to fetch spot details');
        }
      })
      .catch((err) => {
        console.error('Error fetching spot details:', err);
        setError('Error fetching spot details');
      });
  }, [spotId]); // Dependency on spotId to refetch when it changes

  const handleReserveClick = () => {
    alert('Feature coming soon');
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!spot) {
    return <p>Loading...</p>;
  }

  // Destructuring spot details (assuming the structure)
  const { name, city, state, country, description, price, hostFirstName, hostLastName, SpotImages } = spot;

  // Assuming SpotImages is an array with the preview image at the first index
  const previewImageUrl = SpotImages && SpotImages.length > 0 ? SpotImages[0].url : '/default-image.jpg'; // Fallback image

  return (
    <div className="spot-details">
      <h1>{name}</h1>
      <p>Location: {city}, {state}, {country}</p>
      <img src={previewImageUrl} alt={name} className="spot-image" />
      
      <div className="spot-info">
        <div className="host-info">
          Hosted by {hostFirstName} {hostLastName}
        </div>
        <div className="description-and-reserve">
          <p>{description}</p>
          <div className="reserve-box">
            <p>${price}/night</p>
            <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;
