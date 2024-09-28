import React, { useEffect, useState } from "react";
import "./PreviewDiaryBox.css";
import { Link } from "react-router-dom";
import CommunicateMenu from "../../CommunicateMenu/CommunicateMenu";
import Comment from "../../Comment/Comment";
import { api } from "../../../api/axiosInstance";
import { IoMdArrowRoundForward } from "react-icons/io";

interface PreviewModalDiaryBoxProps {
  id: string;
  writer: string;
  date: string;
  content: string;
  like: number;
}

const PreviewModalDiaryBox: React.FC<PreviewModalDiaryBoxProps> = ({
  id,
  writer,
  date,
  content,
  like,
}) => {
  const [seemore, setSeemore] = useState<boolean>(false);

  const [CommentShowState, setCommentShowState] = useState<boolean>(false);

  const [CommentValue, setCommentValue] = useState<object | null>(null);

  useEffect(() => {
    if (CommentShowState) {
      const load_comment = async () => {
        const res = await api.get(`/api/diary/comment?id=${id}`);
        if (res.data) {
          setCommentValue(res.data);
        } else {
          setCommentValue(null);
        }
      };
      load_comment();
    }
  }, [CommentShowState]);

  const handleCommentState = () => {
    setCommentShowState(!CommentShowState);
  };

  return (
    <div className="preview-content-main">
      <div className="preview-content-main__header">
        <p className="preview-content-main__header-title">
          <Link to={`/home/user/${writer}`}>{writer}</Link>의 일기
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
          CommentShowState
            ? CommentValue
              ? ""
              : "no-comment"
            : "comment-close"
        }`}
      >
        {CommentValue ? (
          <Comment />
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3>아직 댓글이 없습니다.</h3>
          </div>
        )}
        <div className="comment-write">
          <input
            type="text"
            className="comment-write__input"
            placeholder="댓글을 입력해주세요."
          />
          <button className="comment-write__submit">
            <IoMdArrowRoundForward fontSize={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModalDiaryBox;
