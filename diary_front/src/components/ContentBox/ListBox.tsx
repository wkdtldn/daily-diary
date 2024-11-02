import { Link, useNavigate } from "react-router-dom";
import "./ListBox.css";
import { CiClock2 } from "react-icons/ci";
import React from "react";
import { api } from "../../api/axiosInstance";

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
  return (
    <button
      className="listbox-wrapper"
      onClick={() => navigate(`/home/diary/${id}`)}
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
          <Link
            to={`/home/user/${writer}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="listbox-middle-writer"
          >
            @{writer}
          </Link>
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
  );
};

export default ListBox;
