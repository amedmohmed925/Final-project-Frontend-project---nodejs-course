import React, { useState } from 'react';
import '../../styles/ContactPage.css'
import HeaderPages from '../../components/HeaderPages';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here (e.g., API call)
  };

  return (
      <div>
            <HeaderPages title={"Contact US"}/>

    <div className="contact-container mt-5">
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
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
        </div>
  );
};

export default ContactPage;