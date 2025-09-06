import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ name, image, link }) => {
  return (
    <Link to={link} className="category-card">
      <div className="category-card-image-wrapper">
        <img src={image} alt={name} className="category-card-image" />
      </div>
      <h3 className="category-card-title">{name}</h3>
    </Link>
  );
};

export default CategoryCard;