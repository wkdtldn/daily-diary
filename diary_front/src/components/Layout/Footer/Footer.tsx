import "./Footer.css";
import { Link, useLocation } from "react-router-dom";
import {
  IoCalendarClearOutline,
  IoCalendarClear,
  IoCompassOutline,
  IoCompass,
  IoPeopleOutline,
  IoPeople,
} from "react-icons/io5";

const Footer = () => {
  const location = useLocation();

  const footerOption = [
    // 달력
    {
      title: "달력",
      location: "/home/calendar",
      icons: <IoCalendarClearOutline />,
      focus: <IoCalendarClear />,
    },
    // 둘러보기
    {
      title: "둘러보기",
      location: "/home/recent",
      icons: <IoCompassOutline />,
      focus: <IoCompass />,
    },
    {
      // 친구들
      title: "친구들",
      location: "/home/friends",
      icon: <IoPeopleOutline />,
      focus: <IoPeople />,
    },
  ];

  return (
    <footer className="Footer">
      {footerOption.map((option) => (
        <Link
          className={`footer-option ${
            location.pathname === option.location ? "selected" : false
          }`}
          to={option.location}
        >
          {location.pathname === option.location ? option.focus : option.icon}
          {option.title}
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
