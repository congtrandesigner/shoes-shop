import { NavLink } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export default function ProductCard({ prod }) {
  return (
    <div className="product-card">
      <FiHeart className="card-heart" />
      <img src={prod.image} alt={prod.name} />
      <h3>{prod.name}</h3>
      <p>{prod.shortDescription}</p>
      <div className="product-bottom">
        <NavLink to={`/detail/${prod.id}`} className="btn-buy">Buy now</NavLink>
        <span>{prod.price}$</span>
      </div>
    </div>
  );
}
