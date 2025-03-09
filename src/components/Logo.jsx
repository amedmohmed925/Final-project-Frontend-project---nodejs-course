import { Link } from 'react-router-dom';

function Logo({ colorText = "#ffffff" }) {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <Link style={{ textDecoration: "none" }} to="/">
        <h1 className="logo">
          <span className="logo-part-1" style={{ color: colorText }}>Cour</span>
          <span className="logo-part-2">ses</span>
          <b className="logo-domain">.com</b>
        </h1>
      </Link>
    </div>
  );
}

export default Logo;