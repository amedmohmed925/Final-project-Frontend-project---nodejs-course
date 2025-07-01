import { useState } from 'react';
import axios from 'axios';
import { Modal, Spinner } from 'react-bootstrap';
import './ContactPage.css';
import HeaderPages from '../shared/components/HeaderPages';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [modal, setModal] = useState({ show: false, success: false, message: "", loading: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModal({ show: true, loading: true, success: false, message: "" });
    try {
      const res = await axios.post("http://localhost:8080/v1/contact", formData);
      setModal({ show: true, loading: false, success: true, message: res.data.message || "Message sent successfully" });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setModal({ show: true, loading: false, success: false, message: err.response?.data?.message || "Failed to send message" });
    }
  };

  return (
    <div>
      <HeaderPages title={"Contact US"} />
      <div className="contact-container my-5">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Suspendisse ultrice gravida dictum fusce placerat ultricies integer
        </p>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-box">
              <h3>
                <span className="icon"><i className="fas fa-map-marker-alt"></i></span> Our Address
              </h3>
              <p>1564 GooseTown Drive, Matthews, NC 28105</p>
            </div>
            <div className="info-box">
              <h3>
                <span className="icon"><i className="fas fa-clock"></i></span> Hours of Operation
              </h3>
              <p>Mon - Fri: 8:00am to 5:00pm</p>
              <p>[2nd Sat: Holiday]</p>
            </div>
            <div className="info-box">
              <h3>
                <span className="icon"><i className="fas fa-phone"></i></span> Contact
              </h3>
              <p>+99-93895-4565</p>
              <p>supportyou@info.com</p>
            </div>
            <div className="customer-care">
              <span>+ Customer Care</span>
            </div>
            <div className="social-icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
              <i className="fas fa-heart"></i>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject*</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
        <svg className="contact-svg" width="326" height="327" viewBox="0 0 326 327" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <rect width="326" height="326" transform="translate(0 0.589844)" fill="url(#pattern0_7_517)" />
          <defs>
            <pattern id="pattern0_7_517" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image0_7_517" transform="scale(0.00306748)" />
            </pattern>
            <image id="image0_7_517" width="326" height="326" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
          </defs>
        </svg>
      </div>
      {/* Modal for success/error */}
      <Modal show={modal.show} onHide={() => setModal({ ...modal, show: false })} centered>
        <Modal.Body className="text-center">
          {modal.loading ? (
            <div>
              <Spinner animation="border" variant="primary" />
              <div className="mt-3">Sending...</div>
            </div>
          ) : modal.success ? (
            <div>
              <div style={{ fontSize: 48, color: '#28a745', marginBottom: 10 }}>
                <i className="fas fa-check-circle fa-spin"></i>
              </div>
              <div style={{ fontWeight: 600 }}>{modal.message}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 48, color: '#dc3545', marginBottom: 10 }}>
                <i className="fas fa-times-circle fa-spin"></i>
              </div>
              <div style={{ fontWeight: 600 }}>{modal.message}</div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ContactPage;