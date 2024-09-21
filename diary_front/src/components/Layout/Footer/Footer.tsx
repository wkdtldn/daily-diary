import "./Footer.css";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  return (
    <footer className="Footer">
      <Link
        className={`footer-option ${
          location.pathname === "/home/calendar" ? "selected" : false
        }`}
        to="/home/calendar"
      >
        달력
      </Link>
      <Link
        className={`footer-option ${
          location.pathname === "/home/recent" ? "selected" : false
        }`}
        to="/home/recent"
      >
        최근
      </Link>
      <Link
        className={`footer-option ${
          location.pathname === "/home/write" ? "selected" : false
        }`}
        to="/home/write"
      >
        작성
      </Link>
    </footer>
  );
};

export default Footer;
