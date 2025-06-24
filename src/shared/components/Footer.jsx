import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer
      className="bg-purple py-5 text-white"
      style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}
    >
      <Container fluid className="px-4 container">
        {/* Top Section with Logo and Newsletter */}
        <Row className="align-items-center  pb-4 border-bottom border-light border-opacity-25 mb-4">
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center">
              <div
                className="bg-white rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
              >
                <span className="fw-bold text-purple" style={{ color: '#6a11cb' }}>
                  EQ
                </span>
              </div>
              <h2 className="ms-3 text-white fw-bold">EduQuest <span style={{marginLeft:"-5px"}} className='fs-6 '>.com</span></h2>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="mb-2 text-white-50 text-md-end">
              <h5 className="fw-light fs-6">Stay updated with our latest courses</h5>
            </div>
            <div className="input-group">
              <input
                type="email"
                className="form-control bg-transparent text-white border-light"
                placeholder="Your email address"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              />
              <button
                className="btn btn-light text-purple fw-medium"
                type="button"
                style={{ color: '#6a11cb' }}
              >
                Subscribe
              </button>
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="gx-3 gx-md-5">
          {/* About Section */}
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <h4
              className="text-white mb-4 position-relative pb-2"
              style={{ borderBottom: '3px solid rgba(255,255,255,0.3)', display: 'inline-block' }}
            >
              About Us
            </h4>
            <p className="text-white-50">
              Empowering learners worldwide with top-quality education since 2020. Our mission is to make professional knowledge accessible to everyone.
            </p>
            <p className="text-white-50 small mt-4">
              © 2025 Course Platform. All rights reserved.
            </p>
          </Col>

          {/* Contact Section */}
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <h4
              className="text-white mb-4 position-relative pb-2"
              style={{ borderBottom: '3px solid rgba(255,255,255,0.3)', display: 'inline-block' }}
            >
              Contact Us
            </h4>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FiMail className="text-white-50 me-3" size={18} />
                <span className="text-white-50">support@courseplatform.com</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FiPhone className="text-white-50 me-3" size={18} />
                <span className="text-white-50">+1-800-555-1234</span>
              </li>
              <li className="d-flex align-items-center">
                <FiMapPin className="text-white-50 me-3" size={18} />
                <span className="text-white-50">123 Learning St, Education City</span>
              </li>
            </ul>
          </Col>

          {/* Social Section */}
          <Col xs={12} md={4}>
            <h4
              className="text-white mb-4 position-relative pb-2"
              style={{ borderBottom: '3px solid rgba(255,255,255,0.3)', display: 'inline-block' }}
            >
              Connect With Us
            </h4>
            <div className="d-flex flex-wrap mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 me-3 text-white"
                style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              >
                <FiFacebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 me-3 text-white"
                style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              >
                <FiTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 me-3 text-white"
                style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 text-white"
                style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              >
                <FiLinkedin size={18} />
              </a>
            </div>
            <p className="text-white-50">
              Follow us on social media for course updates, educational tips, and special offers.
            </p>
          </Col>
        </Row>

        {/* Bottom Links */}
        <Row className="mt-4 pt-4 border-top border-light border-opacity-25">
          <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
              <a href="#" className="text-white-50 text-decoration-none me-4 small">
                Privacy Policy
              </a>
              <a href="#" className="text-white-50 text-decoration-none me-4 small">
                Terms of Service
              </a>
              <a href="#" className="text-white-50 text-decoration-none small">
                Cookie Policy
              </a>
            </div>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-end">
            <span className="text-white-50 small">Designed for professional educators and learners</span>
          </Col>
        </Row>
      </Container>

   
    </footer>
  );
};

export default Footer;