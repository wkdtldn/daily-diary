import { Link } from "react-router-dom";
import "./ContentBox.css";
import { CiClock2 } from "react-icons/ci";
import React from "react";

interface ContentBoxProps {
  writer: string;
  date: string;
  content: string;
  like: number;
  time: string;
}

const ContentBox: React.FC<ContentBoxProps> = ({
  writer,
  date,
  time,
  content,
  like,
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
        <img
          src="https://src.hidoc.co.kr/image/lib/2018/5/18/20180518162239482_0.jpg"
          alt="diary-img"
          height="100%"
        />
      </div>
    </div>
  );
};

export default ContentBox;
