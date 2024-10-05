import "./Footer.css";
import { Link, useLocation } from "react-router-dom";
import {
  IoCalendarClearOutline,
  IoCalendar,
  IoCompassOutline,
  IoCompass,
  IoPeopleOutline,
  IoPeople,
  IoPersonCircleOutline,
  IoPersonCircle,
} from "react-icons/io5";
import { IonFooter, IonIcon } from "@ionic/react";
import {
  calendar,
  calendarOutline,
  compass,
  compassOutline,
  people,
  peopleOutline,
  personCircle,
  personCircleOutline,
} from "ionicons/icons";

const Footer = () => {
  const location = useLocation();

  const footerOption = [
    // 달력
    {
      title: "달력",
      location: "/calendar",
      icons: <IonIcon icon={calendarOutline} size="23" color="gray" />,
      focus: <IonIcon icon={calendar} size="23" color="cornflowerblue" />,
    },
    // 둘러보기
    {
      title: "둘러보기",
      location: "/recent",
      icons: <IonIcon icon={compassOutline} size="23" color="gray" />,
      focus: <IonIcon icon={compass} size="23" color="cornflowerblue" />,
    },
    {
      // 친구들
      title: "친구들",
      location: "/friends",
      icons: <IonIcon icon={peopleOutline} size="23" color="gray" />,
      focus: <IonIcon icon={people} size="23" color="cornflowerblue" />,
    },
    {
      // 내 프로필
      title: "내정보",
      location: "/profile",
      icons: <IonIcon icon={personCircleOutline} size="23" color="gray" />,
      focus: <IonIcon icon={personCircle} size="23" color="cornflowerblue" />,
    },
  ];

  return (
    <IonFooter className="Footer">
      {footerOption.map((option) => (
        <Link
          className={`footer-option ${
            location.pathname === option.location ? "selected" : false
          }`}
          to={option.location}
        >
          {location.pathname === option.location ? option.focus : option.icons}
          <p className="footer-option-title">{option.title}</p>
        </Link>
      ))}
    </IonFooter>
  );
};

export default Footer;
