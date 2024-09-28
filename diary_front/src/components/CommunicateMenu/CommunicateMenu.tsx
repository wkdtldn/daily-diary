import "./CommunicateMenu.css";

import React, { useState } from "react";

import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { TfiComment, TfiCommentAlt } from "react-icons/tfi";
import { IoShareSocialOutline } from "react-icons/io5";

type CommunicateMenuProps = {
  diary_id: string;
  showState: boolean;
  handleFunction: () => void;
};

const CommunicateMenu: React.FC<CommunicateMenuProps> = ({
  showState,
  handleFunction,
}) => {
  const [like, setLike] = useState<boolean>(false);

  return (
    <div className="preview-content-reaction__wrapper">
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
