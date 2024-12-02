import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './SpotDetails.css';

function SpotDetails() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(0);
  const [error, setError] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const sessionUser = useSelector(state => state.session.user);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf/restore', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data['XSRF-Token']); // Assuming the backend returns the CSRF token in this format
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
    // Fetch spot details
    const token = localStorage.getItem('token');  // Assuming you're storing the JWT in localStorage

    fetch(`/api/spots/${spotId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include JWT token
        'X-XSRF-TOKEN': csrfToken,         // Include CSRF token
      },
      credentials: 'include', // To send cookies with the request if needed
    })
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

    // Fetch reviews
    fetch(`/api/spots/${spotId}/reviews`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include JWT token
        'X-XSRF-TOKEN': csrfToken,         // Include CSRF token
      },
      credentials: 'include', // To send cookies with the request if needed
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews(data.Reviews || []);
      })
      .catch((err) => {
        console.error('Error fetching reviews:', err);
        setError('Error fetching reviews');
      })
      .finally(() => {
        setLoadingReviews(false);
      });
  }, [spotId, csrfToken]);  // Dependency on spotId and csrfToken to refetch when they change

  const handleReserveClick = () => {
    alert('Feature coming soon');
  };


  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');  // Get JWT token from localStorage

    try {
      const response = await fetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token
          'X-XSRF-TOKEN': csrfToken,         // Include CSRF token
        },
        credentials: 'include', // To send cookies with the request if needed
        body: JSON.stringify({ review: reviewText, stars }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const newReview = await response.json();
      setReviews((prevReviews) => [newReview, ...prevReviews]);
      setReviewText('');
      setStars(0);
      setShowReviewForm(false); // Close the modal after submitting the review
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');  // Get JWT token from localStorage

    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token
          'X-XSRF-TOKEN': csrfToken,         // Include CSRF token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }

      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  // Calculate average rating and review count
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(2)
    : 'New';
  const reviewCount = reviews.length;

  // Check if the current user has posted a review for this spot
  const userHasPostedReview = reviews.some(review => review.userId === sessionUser?.id);

  // Render the UI based on state
  if (error) {
    return <p>{error}</p>;
  }

  if (!spot) {
    return <p>Loading...</p>;
  }

  const { name, city, state, country, description, price, hostFirstName, hostLastName, SpotImages } = spot;
  const previewImageUrl = SpotImages && SpotImages.length > 0 ? SpotImages[0].url : '/default-image.jpg';

  return (
    <div className="spot-details">
      <h1>{name}</h1>
      <p>Location: {city}, {state}, {country}</p>
      <img src={previewImageUrl} alt={name} className="spot-image" />

      {/* Spot Info */}
      <div className="spot-info">
        <div className="host-info">
          Hosted by {hostFirstName} {hostLastName}
        </div>
        <div className="description-and-reserve">
          <p>{description}</p>
          <div className="reserve-box">
            <div className="price-and-rating">
              <p>${price}/night</p>
              {/* Review Summary */}
              <div className="review-summary">
                <span className="star-icon">★</span>
                <span>{averageRating}</span>
                {reviewCount > 0 && (
                  <>
                    <span> · </span>
                    <span>{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</span>
                  </>
                )}
              </div>
            </div>
            <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {sessionUser && !userHasPostedReview && sessionUser.id !== spot.ownerId && (
          <button onClick={() => setShowReviewForm(true)}>Post Your Review</button>
        )}
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to post a review!</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <p><strong>{review.User?.firstName || 'Unknown'}</strong> - {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <p>{review.review}</p>
                <p>Rating: {review.stars} ⭐</p>
                {sessionUser && sessionUser.id === review.userId && (
                  <button onClick={() => handleDeleteReview(review.id)} className="delete-button">Delete</button>
                )}
              </li>
            ))}
          </ul>
        )}

        {showReviewForm && (
          <div className="review-modal">
            <div className="review-modal-content">
              <h3>How was your stay?</h3>
              <form onSubmit={handleSubmitReview} className="review-form">
                <textarea
                  placeholder="Leave your review here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
                <div>
                  <label>
                    Stars:
                    <select value={stars} onChange={(e) => setStars(Number(e.target.value))} required>
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} ⭐
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button type="submit" disabled={reviewText.length < 10 || stars === 0}>Submit Your Review</button>
              </form>
              <button onClick={() => setShowReviewForm(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotDetails;
