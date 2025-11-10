import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="footer-logo">Little Lemon</p>
          <small>Chicago · West Loop</small>
          <small>© {year} Little Lemon Hospitality</small>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/reservation">Reservations</Link>
          <Link to="/menu">Menu</Link>
          <a href="mailto:hello@littlelemon.com">hello@littlelemon.com</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
