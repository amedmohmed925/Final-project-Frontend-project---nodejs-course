import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editUserInfo } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap'; // استيراد Modal و Button من react-bootstrap
import '../../styles/UpdateInfo.css';

const UpdateInfo = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    password: '',
    newPassword: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false); // حالة لعرض الـ Modal
  const [modalMessage, setModalMessage] = useState(''); // رسالة الـ Modal
  const [isSuccess, setIsSuccess] = useState(false); // تحديد إذا كانت الرسالة نجاح أو فشل

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, dob, password, newPassword } = formData;

    if (!firstName || !lastName || !email || !dob || !password) {
      setModalMessage('Please fill in all required fields.');
      setIsSuccess(false);
      setShowModal(true);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setModalMessage('Please enter a valid email address.');
      setIsSuccess(false);
      setShowModal(true);
      return false;
    }

    if (newPassword && newPassword.length < 6) {
      setModalMessage('New password must be at least 6 characters long.');
      setIsSuccess(false);
      setShowModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUpdating(true);

    try {
      await dispatch(editUserInfo({ id: user._id, updatedData: formData })).unwrap();
      setModalMessage('User information updated successfully!');
      setIsSuccess(true);
      setShowModal(true);
    } catch (error) {
      setModalMessage(error.message || 'Failed to update user info. Please try again.');
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (isSuccess) {
      navigate('/profile'); // العودة إلى صفحة البروفايل بعد التحديث الناجح
    }
  };

  return (
    <div className="update-info-container">

      
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <h2 className="mb-4">Update Info</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dob" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            className="form-control"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Current Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isUpdating}>
          {isUpdating ? <FaSpinner className="spinner" /> : 'Update'}
        </button>
      </form>

      {/* Modal لعرض الرسائل */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isSuccess ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant={isSuccess ? 'success' : 'danger'} onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpdateInfo;