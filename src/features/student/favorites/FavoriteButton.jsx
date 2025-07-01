
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from './favoritesSlice';
import FavoriteHeartIcon from './FavoriteHeartIcon';

const FavoriteButton = ({ courseId, size = 24 }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.user);



  const isFavorite = items.some((c) => c._id === courseId);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!user || user.role !== 'student') return;
    if (isFavorite) {
      dispatch(removeFromFavorites(courseId));
    } else {
      dispatch(addToFavorites(courseId));
    }
  };

  return (
    <span
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={handleToggle}
      style={{ cursor: user && user.role === 'student' ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center' }}
    >
      <FavoriteHeartIcon filled={isFavorite} size={size} />
    </span>
  );
};

export default FavoriteButton;
