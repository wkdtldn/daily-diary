import "./Footer.css";
import { useLocation, NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  addCircle,
  addCircleOutline,
  compass,
  compassOutline,
  home,
  homeOutline,
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
      title: "홈",
      location: "/home",
      icons: <IonIcon icon={homeOutline} size="23" color="gray" />,
      focus: <IonIcon icon={home} size="23" color="cornflowerblue" />,
    },
    // 둘러보기
    {
      title: "둘러보기",
      location: "/home/map",
      icons: <IonIcon icon={compassOutline} size="23" color="gray" />,
      focus: <IonIcon icon={compass} size="23" color="cornflowerblue" />,
    },
    {
      // 일기 작성
      // title: "작성",
      location: "/home/write",
      icons: (
        <IonIcon
          className="footer_write"
          icon={addCircleOutline}
          size="32"
          color="gray"
        />
      ),
      focus: (
        <IonIcon
          className="footer_write"
          icon={addCircle}
          size="32"
          color="cornflowerblue"
        />
      ),
    },
    {
      // 친구들
      title: "친구들",
      location: "/home/friends",
      icons: <IonIcon icon={peopleOutline} size="23" color="gray" />,
      focus: <IonIcon icon={people} size="23" color="cornflowerblue" />,
    },
    {
      // 내 프로필
      title: "내정보",
      location: "/home/profile",
      icons: <IonIcon icon={personCircleOutline} size="23" color="gray" />,
      focus: <IonIcon icon={personCircle} size="23" color="cornflowerblue" />,
    },
  ];

  return (
    <footer className="Footer">
      {footerOption.map((option, index) => (
        <NavLink
          key={index}
          className={`footer-option ${
            location.pathname === option.location ? "selected" : ""
          } ${option.location == "/home/write" ? "footer_write" : ""}`}
          to={option.location}
        >
          {location.pathname === option.location ? option.focus : option.icons}
          <p className="footer-option-title">{option.title}</p>
        </NavLink>
      ))}
    </footer>
  );
};

export default Footer;
