import FavoriteButton from './FavoriteButton';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  for (let i = 1; i <= fullStars; i++) {
    stars.push(<FaStar key={i} className="star filled" />);
  }
  if (hasHalfStar && fullStars < 5) {
    stars.push(<FaStarHalfAlt key={fullStars + 1} className="star filled" />);
  }
  const remainingStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
  for (let i = 1; i <= remainingStars; i++) {
    stars.push(<FaStar key={fullStars + (hasHalfStar ? 2 : 1) + i} className="star" />);
  }
  return stars;
};

const FavoriteCourseCard = ({ course, onRemove }) => {
  const navigate = useNavigate();
  const truncateDescription = (description) =>
    description.length > 50 ? description.substring(0, 50) + '...' : description;
  return (
    <div className="course-card position-relative">
      <div className="course-image position-relative">
        <img
          src={course.featuredImage}
          alt={course.title}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/400x250.png?text=Course+Image')}
        />
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          <FavoriteButton courseId={course._id} size={28} />
        </div>
      </div>
      <div className="course-content">
        <h3 className="course-title d-flex align-items-center justify-content-between">
          {course.title}
          <span className="d-md-none ms-2">
            <FavoriteButton courseId={course._id} size={22} />
          </span>
        </h3>
        <p className="course-description">{truncateDescription(course.description)}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="course-rating">
            {renderStars(course.averageRating)}
            <span>({course.averageRating})</span>
          </div>
          <span className="courseLevel">{course.level}</span>
        </div>
        <button
          className="enroll-btn d-flex justify-content-center mt-2"
          onClick={() => navigate(`/courses/${course._id}`)}
        >
          Enroll Now
          <div className="mx-2">${course.price}</div>
        </button>
        <button
          className="btn btn-outline-danger w-100 mt-2"
          onClick={() => onRemove(course._id)}
        >
          Remove from Favorites
        </button>
      </div>
    </div>
  );
};

export default FavoriteCourseCard;
