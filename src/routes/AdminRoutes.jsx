import { Route, Routes } from 'react-router-dom';
import Dashboard from '../features/admin/components/Dashboard';
import PendingCourses from '../features/admin/pages/PendingCourses';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/pending-courses" element={<PendingCourses />} />
    </Routes>
  );
};

export default AdminRoutes;