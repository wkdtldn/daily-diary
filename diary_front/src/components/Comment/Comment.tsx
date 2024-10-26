import React, { useEffect, useRef, useState } from "react";
import "./Comment.css";

import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { api } from "../../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../hooks/recoil/userState";
import { userSearch } from "../../api/user";
import { writer } from "repl";

interface CommentProps {
  id: number;
  writer: string;
  created_at: string;
  comment: string;
  like_count: number;
  like_list: string[];
}

interface ProfileType {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
  followings: string[];
  following_count: number;
  followers: string[];
  follower_count: number;
  following: boolean;
}

const Comment: React.FC<CommentProps> = ({
  id,
  writer,
  created_at,
  comment,
  like_count,
  like_list,
}) => {
  const login_user = useRecoilValue(LoginUser);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load_proflie = async () => {
      setLoading(true);
      const writer_profile = (await userSearch(writer)) as ProfileType;
      setProfileImage(writer_profile.image);
      setLoading(false);
    };
    load_proflie();
  }, []);

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

  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <article className="comment-container">
          <div className="comment-profile-box">
            <img
              className="comment-profile__img"
              src={profileImage!}
              alt="comment-user_profile"
            />
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
              {/* <span className="comment-main__reaction__comment">답글 달기</span> */}
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
      )}
    </>
  );
};

export default Comment;
