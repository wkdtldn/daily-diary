import { useNavigate } from "react-router-dom";
import "./AlbumsBox.css";
import React from "react";
import { api } from "../../api/axiosInstance";

interface AlbumsBoxProps {
  id: string;
  date: string;
  text: string;
  like_count: number;
  time: string;
  writer: string;
}

const AlbumsBox: React.FC<AlbumsBoxProps> = ({
  id,
  date,
  time,
  like_count,
}) => {
  const navigate = useNavigate();

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

  return (
    <>
      <button
        className="albumsbox-wrapper flex flex-c a-c border-n relative over-h"
        onClick={() => navigate(`/home/diary/${id}`)}
      >
        <div className="m-w m-h flex a-c j-c">
          <div className="albumsbox-date">{content_date.date}</div>
          <div className="albumsbox-like bold absolute">
            좋아요 {like_count}개
          </div>
        </div>
      </button>
    </>
  );
};

export default AlbumsBox;
