import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import '../styles/CategoryManager.css';
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap'; // استيراد مكونات Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // تأكد من إضافة Bootstrap CSS في المشروع

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
      setShowErrorModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const categoryData = { name, description };

    try {
      if (editId) {
        const updatedCategory = await updateCategory(editId, categoryData);
        setCategories(categories.map(cat => (cat._id === editId ? updatedCategory : cat)));
        setSuccess('Category updated successfully');
        setEditId(null);
        setShowEditModal(false); // إغلاق مودال التعديل
      } else {
        const newCategory = await addCategory(categoryData);
        setCategories([...categories, newCategory]);
        setSuccess('Category added successfully');
      }
      setName('');
      setDescription('');
      setShowSuccessModal(true); // عرض مودال النجاح
    } catch (err) {
      setError(err.message);
      setShowErrorModal(true); // عرض مودال الخطأ
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name);
    setDescription(category.description);
    setShowEditModal(true); // عرض مودال التعديل
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(cat => cat._id !== id));
        setSuccess('Category deleted successfully');
        setShowSuccessModal(true);
      } catch (err) {
        setError(err.message);
        setShowErrorModal(true);
      }
    }
  };

  const closeModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setShowEditModal(false);
    setError('');
    setSuccess('');
  };

  return (
    <div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>
      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="category-manager">
        <h1 className="hero-title">Category Management</h1>
        <p className="hero-subtitle">Easily add, edit, or delete categories.</p>

        {/* نموذج الإضافة */}
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="search-input"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              className="search-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" className="search-button">
              Add
            </button>
          </div>
        </form>

        {/* قائمة الكاتيجوريز */}
        <div className="categories-list">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category._id} className="category-card">
                <h3>{category.name}</h3>
                <p>{category.description || 'No description'}</p>
                <div className="category-actions">
                  <button className="edit-btn" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(category._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
      </div>

      {/* مودال النجاح */}
      <Modal show={showSuccessModal} onHide={closeModals}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{success}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال الخطأ */}
      <Modal show={showErrorModal} onHide={closeModals}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال التعديل */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button variant="primary" type="submit" className="mt-3">
              Update
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryManager;