import "./CommunicateMenu.css";

import React, { useEffect, useRef, useState } from "react";

import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { TfiComment, TfiCommentAlt } from "react-icons/tfi";
import { IoShareSocialOutline } from "react-icons/io5";
import { api } from "../../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../hooks/recoil/userState";

interface CommunicateMenuProps {
  diary_id: string;
  like_list: string[];
  like_count: number;
  showState: boolean;
  handleFunction: () => void;
}

const CommunicateMenu: React.FC<CommunicateMenuProps> = ({
  diary_id,
  like_count,
  like_list,
  showState,
  handleFunction,
}) => {
  const isMounted = useRef(false);

  const login_user = useRecoilValue(LoginUser);

  const [like, setLike] = useState<boolean>(
    like_list.includes(login_user.username)
  );

  useEffect(() => {
    if (isMounted.current) {
      const like_diary = async () => {
        await api.post(`/api/diary/like/${diary_id}/`, {});
      };
      like_diary();
    } else {
      isMounted.current = true;
    }
  }, [like]);

  return (
    <div className="preview-content-reaction__wrapper">
      <span className="preview-content_like-count">
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
      <button
        className="preview-content-reaction preview-content-reaction__like"
        onClick={() => setLike(!like)}
      >
        {like ? <IoIosHeart /> : <IoIosHeartEmpty />}
      </button>
      <button
        onClick={handleFunction}
        className="preview-content-reaction preview-content-reaction__comment"
      >
        {showState ? <TfiCommentAlt /> : <TfiComment />}
      </button>
      <button className="preview-content-reaction preview-content-reaction__share">
        <IoShareSocialOutline />
      </button>
    </div>
  );
};

export default CommunicateMenu;
