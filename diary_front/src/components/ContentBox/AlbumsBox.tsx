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
  images: string[];
}

const AlbumsBox: React.FC<AlbumsBoxProps> = ({
  id,
  date,
  time,
  like_count,
  images,
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

  const date_ = new Date(date);
  return (
    <button
      className="albumsbox-wrapper"
      onClick={() => navigate(`/home/diary/${id}`)}
    >
      <div
        className={`albumsbox-content ${
          images[0] !== null ? "imageBackground" : ""
        }`}
        style={
          {
            "--profile-bg-image-url": `url(${
              api.defaults.baseURL + "/" + images[0]
            })`,
          } as React.CSSProperties
        }
      >
        <div className="albumsbox-date">{content_date.date}</div>
        <div className="albumsbox-like">좋아요 {like_count}개</div>
      </div>
    </button>
  );
};

export default AlbumsBox;
