import { FaHeart } from 'react-icons/fa';

const FavoriteHeartIcon = ({ filled, size = 24 }) => {
  return filled ? (
    <FaHeart style={{ color: '#e63946', fontSize: size, transition: 'color 0.2s', filter: 'drop-shadow(0 0 2px #e63946)' }} />
  ) : (
    <FaHeart style={{ color: 'transparent', fontSize: size, stroke: '#e63946', strokeWidth: 40, filter: 'drop-shadow(0 0 2px #e63946)', fill: 'none' }} />
  );
};

export default FavoriteHeartIcon;
