import React, { useEffect, useRef, useState } from "react";
import "./Comment.css";

import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { api } from "../../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../hooks/recoil/userState";
import { useSpring, animated } from "@react-spring/web";

interface CommentProps {
  id: number;
  writer: string;
  created_at: string;
  comment: string;
  like_count: number;
  like_list: string[];
  writer_profile: string;
  load_comment: () => void;
}

const Comment: React.FC<CommentProps> = ({
  id,
  writer,
  created_at,
  comment,
  like_count,
  like_list,
  writer_profile,
  load_comment,
}) => {
  const login_user = useRecoilValue(LoginUser);

  const isMounted = useRef(false);

  const generalTime = () => {
    const datetime = new Date(created_at);

    const formattedDate = datetime.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = datetime.toLocaleTimeString("ko-KR", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });

    return `${formattedDate} - ${formattedTime}`;
  };

  const [like, setLike] = useState<boolean>(
    like_list.includes(login_user.username)
  );

  useEffect(() => {
    if (isMounted.current) {
      const like_comment = async () => {
        await api.post(`/api/comments/${id}/like/`, {});
      };
      like_comment();
    } else {
      isMounted.current = true;
    }
  }, [like]);

  const [showOptions, setShowOptions] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseDown = () => {
    pressTimer.current = setTimeout(() => {
      setShowOptions(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const [showMore, setShowMore] = useState<boolean>(false);

  const CommentOptionAnimation = useSpring({
    width: showOptions ? "85px" : "0px",
    height: showOptions ? "33px" : "0px",
    opacity: showOptions ? 1 : 0,
    transform: showOptions
      ? "translateY(200%) translateX(200%)"
      : "translateY(0%) translateX(0%)",
  });

  const deleteComment = async () => {
    const res = window.confirm("댓글을 삭제하시겠습니까?");
    if (res) {
      await api.delete(`/api/comments/${id}/`);
      load_comment();
    } else {
    }
  };

  return (
    <>
      <article
        className={`relative m-w h-a pt-10 pb-10 flex ${
          showOptions ? "comment_select" : ""
        } `}
        style={{ minHeight: "95px", gap: "10px", borderRadius: "7px" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <div className="mt-10 relative over-h" style={{ width: "35px" }}>
          <img
            className="round fitimg mt-5"
            style={{ width: "35px", height: "35px" }}
            src={writer_profile}
            alt="comment-user_profile"
          />
        </div>
        <div className="f-1 flex flex-c j-c">
          <div className="m-w flex a-c j-fs" style={{ gap: "5px" }}>
            <span className="comment-main-username sumtext w-a bold">
              {writer}
            </span>
            <span className="comment-main-created_at">{generalTime()}</span>
          </div>
          <span
            className={`comment-main-detail ${
              showMore ? "" : "not_seemore_comment"
            }`}
            onClick={() => setShowMore(!showMore)}
          >
            {comment}
          </span>
          <div className="comment-main__reaction-history-box flex">
            <span onClick={() => setLike(!like)}>
              좋아요{" "}
              {like_list.includes(login_user.username)
                ? !like
                  ? like_count - 1
                  : like_count
                : like
                ? like_count + 1
                : like_count}
              개
            </span>
          </div>
        </div>
        <div
          className="flex a-fs j-c"
          style={{ width: "35px", marginTop: "15px" }}
        >
          <button
            className="m-w flex a-c j-c border-n bg-n"
            style={{ fontSize: "larger" }}
            onClick={() => setLike(!like)}
          >
            {like ? <IoHeart /> : <IoHeartOutline />}
          </button>
        </div>
        {writer === login_user.username ? (
          <animated.button
            style={CommentOptionAnimation}
            className="comment-option"
            onClick={deleteComment}
          >
            삭제
          </animated.button>
        ) : (
          <animated.button
            style={CommentOptionAnimation}
            className="comment-option"
            onClick={() => setLike(!like)}
          >
            {like ? "좋아요 취소" : "좋아요"}
          </animated.button>
        )}
      </article>
      {showOptions ? (
        <div
          className="comment-overlay fixed m-w top left"
          onClick={() => setShowOptions(false)}
        ></div>
      ) : (
        false
      )}
    </>
  );
};

export default Comment;
