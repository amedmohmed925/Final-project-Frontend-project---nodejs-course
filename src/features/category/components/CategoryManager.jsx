import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import '../styles/CategoryManager.css';
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaArrowLeft, FaArrowRight, FaPlus, FaEdit, FaTrash, FaTags, FaFolder } from 'react-icons/fa';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        setShowEditModal(false);
      } else {
        const newCategory = await addCategory(categoryData);
        setCategories([...categories, newCategory]);
        setSuccess('Category added successfully');
      }
      setName('');
      setDescription('');
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message);
      setShowErrorModal(true);
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name);
    setDescription(category.description);
    setShowEditModal(true);
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
    <div className="admin-page-wrapper" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        style={{
          position: 'fixed',
          top: '50%',
          left: isSidebarOpen ? '280px' : '20px',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div style={{
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        padding: '40px 20px'
      }}>
        <Container>
          <div className="text-center mb-5">
            <h1 style={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <FaTags />
              Category Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Manage your course categories efficiently
            </p>
          </div>

          <Row className="justify-content-center mb-5">
            <Col md={8} lg={6}>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter category name"
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter category description"
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </Form.Group>

                  <Button 
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 24px',
                      width: '100%',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}
                  >
                    <FaPlus className="me-2" />
                    Add Category
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>

          <div className="categories-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
            padding: '20px 0'
          }}>
            {categories.map((category) => (
              <div
                key={category._id}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="category-card"
              >
                <div className="d-flex align-items-center mb-3">
                  <FaFolder className="me-2" style={{ color: '#667eea', fontSize: '1.5rem' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {category.name}
                  </h3>
                </div>
                <p className="text-muted mb-4">{category.description || 'No description'}</p>
                <div className="d-flex gap-2">
                  <Button
                    onClick={() => handleEdit(category)}
                    variant="outline-primary"
                    style={{ flex: 1, borderRadius: '8px' }}
                  >
                    <FaEdit className="me-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(category._id)}
                    variant="outline-danger"
                    style={{ flex: 1, borderRadius: '8px' }}
                  >
                    <FaTrash className="me-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={closeModals} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ color: '#059669' }}>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{success}</Modal.Body>
        <Modal.Footer style={{ border: 'none' }}>
          <Button 
            variant="success" 
            onClick={closeModals}
            style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={closeModals} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ color: '#dc2626' }}>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer style={{ border: 'none' }}>
          <Button 
            variant="danger" 
            onClick={closeModals}
            style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                width: '100%'
              }}
            >
              Update Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryManager;