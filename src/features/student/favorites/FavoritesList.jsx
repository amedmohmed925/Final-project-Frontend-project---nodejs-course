import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFromFavorites } from './favoritesSlice';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaHeart } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import FavoriteCourseCard from './FavoriteCourseCard';

const FavoritesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = (courseId) => {
    dispatch(removeFromFavorites(courseId));
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="favorites-list container py-4">
      <h2 className="mb-4"><FaHeart className="text-danger me-2" /> My Favorite Courses</h2>
      {items.length === 0 ? (
        <div className="text-center">No favorite courses yet.</div>
      ) : (
        <div className="courses-grid">
          {items.map((course) => (
            <FavoriteCourseCard key={course._id} course={course} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
