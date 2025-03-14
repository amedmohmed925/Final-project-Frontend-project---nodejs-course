import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* القسم الأول: العنوان والعنونة */}
          <div className="col-md-3 mb-4">
            <h5>EDUNITY</h5>
            <p>1235 Blog Street</p>
            <p>Phone: 876 776 080</p>
            <p>Email: info@edu.com</p>
          </div>

          {/* القسم الثاني: الخدمات */}
          <div className="col-md-3 mb-4">
            <h5>Our Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Web Design</a></li>
              <li><a href="#" className="text-white text-decoration-none">Graphic Design</a></li>
              <li><a href="#" className="text-white text-decoration-none">Digital Marketing</a></li>
              <li><a href="#" className="text-white text-decoration-none">SEO Optimization</a></li>
            </ul>
          </div>

          {/* القسم الثالث: معرض الصور */}
          <div className="col-md-3 mb-4">
            <h5>Gallery</h5>
            <div className="row">
              {/* صور صغيرة */}
              {[...Array(6)].map((_, index) => (
                <div className="col-4 mb-2" key={index}>
                  <img
                    src="https://via.placeholder.com/50x50"
                    alt="gallery"
                    className="img-fluid"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* القسم الرابع: الاشتراك في النشرة */}
          <div className="col-md-3 mb-4">
            <h5>Subscribe</h5>
            <p>Subscribe to our newsletter for the latest updates.</p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                aria-label="Recipient's email"
              />
              <button className="btn btn-warning" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;