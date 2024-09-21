import React, { useState } from "react";
import "./Comment.css";

import { IoHeartOutline, IoHeart } from "react-icons/io5";

const Comment: React.FC = () => {
  const [like, setLike] = useState<boolean>(false);

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
          <span className="comment-main-username">jangsiwoo9108</span>
          <span className="comment-main-created_at">8/28 - 5:24 PM</span>
        </div>
        <span className="comment-main-detail">댓글 입니다 오해 ㄴㄴ</span>
        <div className="comment-main__reaction-history-box">
          <span
            className="comment-main__reaction__heart-history"
            onClick={() => setLike(!like)}
          >
            좋아요 1,932개
          </span>
          <span className="comment-main__reaction__comment">답글 달기</span>
          {/* <div className="comment-main__reaction__comment"></div> */}
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
