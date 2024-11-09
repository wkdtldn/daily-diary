import { Link, useNavigate } from "react-router-dom";
import "./ListBox.css";
import { CiClock2 } from "react-icons/ci";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api/axiosInstance";
import { useSpring, animated } from "@react-spring/web";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../hooks/recoil/userState";
import RemoveComponent from "../modal/question/Remove";

type probsPiece = {
  name: string;
  pv: number;
};

interface ListBoxProps {
  id: string;
  writer: string;
  date: string;
  text: string;
  time: string;
  images: string[];
}

const ListBox: React.FC<ListBoxProps> = ({
  id,
  writer,
  date,
  time,
  images,
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const login_user = useRecoilValue(LoginUser);

  const navigate = useNavigate();

  const get_day = (idx: number) => {
    const day = ["월", "화", "수", "목", "금", "토", "일"];
    return day[idx];
  };

  const generalTime = () => {
    const datetime = new Date(date + "T" + time + "Z");

    const formattedDate = datetime.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    const formattedTime = datetime.toLocaleTimeString("ko-KR", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    return { formatted_date: formattedDate, formatted_time: formattedTime };
  };

  const content_date = {
    date: generalTime().formatted_date,
    time: generalTime().formatted_time,
  };

  const date_ = new Date(date);

  const [showOptions, setShowOptions] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ClickOther = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("diary-options")) {
      setShowOptions(false);
    } else {
    }
  };

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("mousedown", ClickOther);
    }
    return () => {
      document.removeEventListener("mousedown", ClickOther);
    };
  }, [showOptions]);

  const handleMouseDown = () => {
    pressTimer.current = setTimeout(() => {
      setShowOptions(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    if (!showOptions) {
      navigate(`/home/diary/${id}`);
    }
  };

  const DiaryOptionAnimation = useSpring({
    width: showOptions ? "85px" : "0px",
    height: showOptions ? "33px" : "0px",
    opacity: showOptions ? 1 : 0,
    transform: showOptions
      ? "translateY(200%) translateX(100%)"
      : "translateY(0%) translateX(0%)",
    zIndex: 10000,
  });

  return (
    <div style={{ width: "100%", height: "auto", position: "relative" }}>
      <article
        className="listbox-wrapper"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <div className="listbox-left">
          <span className="listbox-left-date__date">{date_.getDate()}</span>
          <span className="listbox-left-date__day">
            {get_day(date_.getDay())}
          </span>
        </div>
        <div className="listbox-middle">
          <span className="listbox-middle-date">{content_date.date}</span>
          <div className="listbox-middle__detail-wrapper">
            <span
              onClick={(e) => e.stopPropagation()}
              className="listbox-middle-writer"
            >
              @{writer}
            </span>
            <span className="listbox-middle-timeline">
              <CiClock2 className="clock-icon" />
              {content_date.time}
            </span>
          </div>
        </div>
        <div className="listbox-right">
          {images.length > 0 ? (
            <img
              className="diary-listbox-img"
              src={api.defaults.baseURL + "/" + images[0]}
              alt="diary-img"
            />
          ) : (
            ""
          )}
        </div>
      </article>
      {writer === login_user.username ? (
        <>
          <animated.button
            style={DiaryOptionAnimation}
            className="diary-options"
            onClick={(e) => {
              e.stopPropagation();
              modalRef.current?.showModal();
            }}
          >
            삭제
          </animated.button>
          <RemoveComponent
            modalRef={modalRef}
            diary_id={id}
            navigate={navigate}
          />
        </>
      ) : (
        <>
          <animated.button
            style={DiaryOptionAnimation}
            className="diary-options"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/home/user/${writer}`);
            }}
          >
            프로필보기
          </animated.button>
          <RemoveComponent
            modalRef={modalRef}
            diary_id={id}
            navigate={navigate}
          />
        </>
      )}
    </div>
  );
};

export default ListBox;
