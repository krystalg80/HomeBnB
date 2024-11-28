import { useEffect, useState } from 'react';
import SpotTile from '../SpotTile/SpotTile';
import './LandingPage.css';

function LandingPage() {
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch spots data from your backend
    fetch('/api/spots')
      .then(response => {
        console.log('Response:', response); // Log the response
        return response.json();
      })
      .then(data => {
        console.log('Data:', data); // Log the data
        if (data.spots) {
          setSpots(data.spots);
        } else {
          setError('Failed to fetch spots');
        }
      })
      .catch(error => {
        console.error('Error fetching spots:', error);
        setError('Error fetching spots');
      });
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to HomeBnB</h1>
        <p>Book unique homes and experiences all over the world.</p>
      </header>
      <section className="landing-content">
        {error ? (
          <p>{error}</p>
        ) : (
          spots.map(spot => (
            <SpotTile key={spot.id} spot={spot} />
          ))
        )}
      </section>
    </div>
  );
}

export default LandingPage;