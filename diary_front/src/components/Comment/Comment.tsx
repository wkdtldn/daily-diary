import React, { useEffect, useState } from "react";
import "./Comment.css";

import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { api } from "../../api/axiosInstance";

interface CommentProps {
  id: string;
  writer: string;
  created_at: string;
  comment: string;
  like_count: number;
}

const Comment: React.FC<CommentProps> = ({
  id,
  writer,
  created_at,
  comment,
  like_count,
}) => {
  const generalTime = () => {
    const datetime = new Date(created_at);

    const formattedDate = datetime.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = datetime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${formattedDate} - ${formattedTime}`;
  };

  const [like, setLike] = useState<boolean>(false);

  useEffect(() => {
    const like_comment = async () => {
      await api.post(`/api/comments/${id}/like/`);
    };
    like_comment();
  }, [like]);

  return (
    <article className="comment-container">
      <div className="comment-profile-box">
        <div className="comment-profile">
          <img
            className="comment-profile__img"
            src="https://www.studiopeople.kr/common/img/default_profile.png"
            alt="comment-user_profile"
          />
        </div>
      </div>
      <div className="comment-main">
        <div className="comment-main__info-box">
          <span className="comment-main-username">{writer}</span>
          <span className="comment-main-created_at">{generalTime()}</span>
        </div>
        <span className="comment-main-detail">{comment}</span>
        <div className="comment-main__reaction-history-box">
          <span
            className="comment-main__reaction__heart-history"
            onClick={() => setLike(!like)}
          >
            좋아요 {like_count}개
          </span>
          <span className="comment-main__reaction__comment">답글 달기</span>
        </div>
      </div>
      <div className="comment-reaction">
        <button
          className="comment-reaction__heart"
          onClick={() => setLike(!like)}
        >
          {like ? <IoHeart /> : <IoHeartOutline />}
        </button>
      </div>
    </article>
  );
};

export default Comment;
