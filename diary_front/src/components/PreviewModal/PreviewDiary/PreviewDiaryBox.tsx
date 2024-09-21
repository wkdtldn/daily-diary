import React, { useState } from "react";
import "./PreviewDiaryBox.css";
import { Link } from "react-router-dom";
import CommunicateMenu from "../../CommunicateMenu/CommunicateMenu";
import Comment from "../../Comment/Comment";

interface PreviewModalDiaryBoxProps {
  writer: string;
  date: string;
  content: string;
  like: number;
}

const PreviewModalDiaryBox: React.FC<PreviewModalDiaryBoxProps> = ({
  writer,
  date,
  content,
  like,
}) => {
  const [seemore, setSeemore] = useState<boolean>(false);

  const [CommentShowState, setCommentShowState] = useState<boolean>(false);

  const handleCommentState = () => {
    setCommentShowState(!CommentShowState);
  };

  return (
    <div className="preview-content-main">
      <div className="preview-content-main__header">
        <p className="preview-content-main__header-title">
          <Link to={"/user/username"}>{writer}</Link>의 일기
        </p>
      </div>
      <div
        className={`preview-content-main__detail ${
          seemore ? "" : "not_seemore"
        }`}
      >
        <div
          className={`preview-content-main__detail-contents ${
            seemore ? "" : "not_seemore_contents"
          }`}
          onClick={() => setSeemore(!seemore)}
        >
          {content}
        </div>
        <CommunicateMenu
          showState={CommentShowState}
          handleFunction={handleCommentState}
        />
      </div>
      <div
        className={`preview-comment-wrapper ${
          CommentShowState ? "" : "comment-close"
        }`}
      >
        <Comment />
      </div>
    </div>
  );
};

export default PreviewModalDiaryBox;
