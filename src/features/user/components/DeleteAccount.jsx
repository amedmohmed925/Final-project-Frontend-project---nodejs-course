import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../api/userApi"; // تأكد من تعديل المسار حسب هيكل مشروعك

const DeleteAccountModal = ({ show, onHide }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteUser(user._id, password);
      localStorage.removeItem("accessToken"); // حذف التوكن بعد الحذف
      alert("Account deleted successfully!");
      navigate("/login"); // إعادة توجيه لصفحة الـ Login
    } catch (err) {
      setError(err.message || "An error occurred while deleting your account");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Your Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <Form onSubmit={handleDelete}>
          <Form.Group controlId="password">
            <Form.Label>Enter your password to confirm:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <p className="text-danger mt-2">{error}</p>}
          <Button variant="danger" type="submit" className="mt-3">
            Delete Account
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAccountModal;