import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFromFavorites } from './favoritesSlice';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaHeart,FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import FavoriteCourseCard from './FavoriteCourseCard';
import { motion } from "framer-motion";
import SidebarProfile from "../../user/components/SidebarProfile";

const FavoritesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const { items, loading, error } = useSelector((state) => state.favorites);

  useEffect(() => {
      console.log('fetchFavorites called');

    dispatch(fetchFavorites());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
console.log('loading:', loading, 'error:', error, 'items:', items);
  const handleRemove = (courseId) => {
    dispatch(removeFromFavorites(courseId));
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <>
     <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      {/* Sidebar */}
      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    <div className="favorites-list container py-4">
      <div className="mb-4  text-center">
        
            <motion.h2
              className="fs-4 fw-bold mb-0 mt-3 section-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Favorite Courses
            </motion.h2>
            
          </div>
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
    </>
  );
};

export default FavoritesList;
