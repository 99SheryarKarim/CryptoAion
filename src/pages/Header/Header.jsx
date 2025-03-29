import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.css";
import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    closeMenu();
    navigate("/contact");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" onClick={closeMenu} style={{ display: "flex", color: "white", textDecoration: "none" }}>
            {/* ✅ Corrected logo usage */}
            <img src="/logoooo.png" alt="TNC CRYPTO" />
            <h2 style={{ marginTop: "8px" }}>AION AI</h2>
          </Link>
        </div>

        <div className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li> 
            <li><Link to="/about" onClick={closeMenu}>About</Link></li>
            <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
            <li><Link to="/coins" onClick={closeMenu}>Market</Link></li>
            <li><Link to="/predict" onClick={closeMenu}>Predict</Link></li>
            <li><Link to="/portfolio" onClick={closeMenu}>Portfolio</Link></li>
            <li className="no-wrap"><Link to="/gopro" onClick={closeMenu}>Go Premium</Link></li>
            <li><Link to="/info" onClick={closeMenu}>Info</Link></li> 
            <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
          </ul>

          <button className="contact-btn" onClick={handleContactClick}>
            Contact Us
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
