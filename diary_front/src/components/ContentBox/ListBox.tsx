import { Link, useNavigate } from "react-router-dom";
import "./ListBox.css";
import { CiClock2 } from "react-icons/ci";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api/axiosInstance";
import { useSpring, animated } from "@react-spring/web";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../hooks/recoil/userState";

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
  const login_user = useRecoilValue(LoginUser);

  const navigate = useNavigate();

  const get_day = (idx: number) => {
    const day = ["월", "화", "수", "목", "금", "토", "일"];
    return day[idx];
  };

  const createDate = (dateStr: string, timeStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const [hours, minutes, seconds] = timeStr.split(":");

    // Date 객체를 생성하고, 날짜와 시간을 설정
    const datetime = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    );
    return datetime;
  };

  const generalTime = () => {
    const datetime = createDate(date, time);

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
  const [isScroll, setIsScroll] = useState(false);

  const ClickOther = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("diary-options")) {
      setShowOptions(false);
    } else {
      return;
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
      if (!isScroll) {
        setShowOptions(true);
      }
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    if (!showOptions && !isScroll) {
      navigate(`/home/diary/${id}`);
    }
    setIsScroll(false);
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

  const delete_diary = async () => {
    const res = window.confirm(
      "일기를 삭제하실 경우 다시 복구할 수 없습니다.\n정말 삭제하시겠습니까?"
    );
    if (res) {
      await api.delete(`/api/diary/delete/${id}/`).then((res) => {
        if (res.status === 204) {
          navigate("/home/calendar");
          window.location.reload();
        } else {
        }
      });
    } else {
    }
  };

  return (
    <div style={{ width: "100%", height: "auto", position: "relative" }}>
      <button
        className="listbox-wrapper"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onMouseMove={() => setIsScroll(true)}
        onTouchMove={() => setIsScroll(true)}
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
            <span className="listbox-middle-writer">@{writer}</span>
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
      </button>
      {writer === login_user.username ? (
        <>
          <animated.button
            style={DiaryOptionAnimation}
            className="diary-options"
            onClick={(e) => {
              e.stopPropagation();
              delete_diary();
            }}
          >
            삭제
          </animated.button>
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
        </>
      )}
    </div>
  );
};

export default ListBox;
