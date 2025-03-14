import { Link } from 'react-router-dom';
import '../styles/Header.css'
function Logo() {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <Link style={{ textDecoration: "none" }} to="/">
        <h1 className="logo">
          <span className="lgo-part-1 text-dark">Edu</span>
          <span className="logo-part-2">Quest</span>
          <b className="logo-domain text-dark">.com</b>
        </h1>
      </Link>
    </div>
  );
}

export default Logo;