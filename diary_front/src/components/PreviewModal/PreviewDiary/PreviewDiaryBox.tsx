import React, { useEffect, useState } from "react";
import "./PreviewDiaryBox.css";
import { Link } from "react-router-dom";
import CommunicateMenu from "../../CommunicateMenu/CommunicateMenu";
import Comment from "../../Comment/Comment";
import { api } from "../../../api/axiosInstance";
import { IoMdArrowRoundForward } from "react-icons/io";
import { fetchCookies } from "../../../api/token";

interface PreviewModalDiaryBoxProps {
  id: string;
  writer: string;
  date: string;
  content: string;
  like: number;
}

type Comment = {
  id: string;
  writer_name: string;
  diary: number;
  like: number;
  created_at: string;
  comment: string;
};

const PreviewModalDiaryBox: React.FC<PreviewModalDiaryBoxProps> = ({
  id,
  writer,
  date,
  content,
  like,
}) => {
  const [seemore, setSeemore] = useState<boolean>(false);

  const [CommentShowState, setCommentShowState] = useState<boolean>(false);

  const [CommentInputValue, setCommentInputValue] = useState<string>("");

  const [CommentValue, setCommentValue] = useState<Comment[] | null>(null);

  useEffect(() => {
    if (CommentShowState) {
      const load_comment = async () => {
        const csrftoken = await fetchCookies();
        const res = await api.get(`/api/comment/?id=${id}`, {
          headers: {
            "X-CSRFToken": csrftoken!,
          },
        });
        if (res.data[0]) {
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

  const createComment = () => {
    if (CommentInputValue) {
      const write_comment = async () => {
        const csrftoken = await fetchCookies();
        await api.post(
          "/api/comment/write/",
          {
            diary: id,
            comment: CommentInputValue,
          },
          {
            headers: {
              "X-CSRFToken": csrftoken!,
            },
          }
        );
      };
      write_comment();
    } else {
      alert("댓글을 작성해주세요");
    }
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
              : "no_comment"
            : "comment-close"
        }`}
      >
        {CommentValue ? (
          CommentValue.map((comment, value) => (
            <Comment
              id={comment.id}
              writer={comment.writer_name}
              comment={comment.comment}
              created_at={comment.created_at}
              like_count={comment.like}
              key={value}
            />
          ))
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
            value={CommentInputValue}
            onChange={(e) => setCommentInputValue(e.target.value)}
            type="text"
            className="comment-write__input"
            placeholder="댓글을 입력해주세요."
          />
          <button className="comment-write__submit" onClick={createComment}>
            <IoMdArrowRoundForward fontSize={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModalDiaryBox;
