import { Link } from "react-router-dom";
import "./ContentBox.css";
import { CiClock2 } from "react-icons/ci";
import React, { useEffect, useRef } from "react";
import { image } from "ionicons/icons";

interface ContentBoxProps {
  writer: string;
  date: string;
  text: string;
  content: string;
  like: number;
  time: string;
  images: string[];
}

const ContentBox: React.FC<ContentBoxProps> = ({
  writer,
  date,
  time,
  content,
  like,
  images,
}) => {
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
    <div className="content-wrapper">
      <div className="content-left">
        <span className="content-left-date__date">{date_.getDate()}</span>
        <span className="content-left-date__day">
          {get_day(date_.getDay())}
        </span>
      </div>
      <div className="content-middle">
        <span className="content-middle-date">{content_date.date}</span>
        <div className="content-middle__detail-wrapper">
          <Link to={`/home/user/${writer}`} className="content-middle-writer">
            @{writer}
          </Link>
          <span className="content-middle-timeline">
            <CiClock2 className="clock-icon" />
            {content_date.time}
          </span>
        </div>
      </div>
      <div className="content-right">
        {images[0] ? (
          <img className="diary-content-img" src={images[0]} alt="diary-img" />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ContentBox;
