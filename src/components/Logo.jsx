import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Logo({ isHomePage, isScrolled }) {
  // اللون أبيض إذا كان في الصفحة الرئيسية ولم يتم التمرير، وإلا أسود
  const textColor = isHomePage && !isScrolled ? "text-white" : "text-dark";

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Link style={{ textDecoration: "none" }} to="/">
        <h1 className="logo">
          <span className={`lgo-part-1 ${textColor}`}>Edu</span>
          <span className="logo-part-2">Quest</span>
          <b className={`logo-domain ${textColor}`}>.com</b>
        </h1>
      </Link>
    </div>
  );
}

export default Logo;