import { Link } from 'react-router-dom';
import './SpotTile.css';

function SpotTile({ spot }) {
  const { id, thumbnail, city, state, name, rating, price } = spot;

  return (
    <Link to={`/spots/${id}`} className="spot-tile">
      <img src={thumbnail} alt={name} className="spot-thumbnail" />
      <div className="spot-info">
        <div className="spot-location">
          {city}, {state}
        </div>
        <div className="spot-name" title={name}>
          {name}
        </div>
        <div className="spot-rating">
          {rating ? rating : 'New'}
        </div>
        <div className="spot-price">
          ${price}/night
        </div>
      </div>
    </Link>
  );
}

export default SpotTile;