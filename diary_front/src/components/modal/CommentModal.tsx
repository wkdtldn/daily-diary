import "./CommentModal.css";

import React, { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close, send } from "ionicons/icons";
import { useSpring, animated } from "@react-spring/web";
import Comment from "../Comment/Comment";

type Comment = {
  id: number;
  writer_name: string;
  diary: string;
  like_count: number;
  created_at: string;
  comment: string;
  likes: string[];
  writer_image_url: string;
};

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  diary_id: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  diary_id,
}) => {
  const [CommentValue, setCommentValue] = useState<string>("");

  const [comments, setComments] = useState<Comment[] | null>(null);

  const load_comment = async () => {
    const res = await api.get(`/api/comments/${diary_id}`);
    if (res.data[0]) {
      setComments(res.data);
    } else {
      setComments(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      load_comment();
    }
  }, [isOpen]);

  const animation = useSpring({
    transform: isOpen ? `translateY(25%)` : `translateY(125%)`,
    opacity: 1,
    config: { tension: 170, friction: 26 },
  });

  const overlay_animation = useSpring({
    display: isOpen ? "block" : "none",
    opacity: isOpen ? 0.3 : 0,
  });

  const addComment = () => {
    if (CommentValue) {
      const write_comment = async () => {
        await api.post("/api/comments/", {
          diary: diary_id,
          comment: CommentValue,
        });
        setCommentValue("");
        load_comment();
      };
      write_comment();
    } else {
      alert("내용이 비여있습니다.");
    }
  };

  return (
    <>
      <animated.div
        style={overlay_animation}
        className="commentModalOverlay"
        onClick={onClose}
      ></animated.div>
      <animated.div style={animation} className="commentModal">
        <div className="commentModal-header">
          <span>댓글</span>
          <button className="commentModal-cancel" onClick={onClose}>
            <IonIcon icon={close} />
          </button>
        </div>
        <div className="commentModal-body">
          {comments ? (
            comments.map((comment, value) => (
              <Comment
                id={comment.id}
                writer={comment.writer_name}
                comment={comment.comment}
                created_at={comment.created_at}
                like_count={comment.like_count}
                like_list={comment.likes}
                writer_profile={comment.writer_image_url}
                load_comment={load_comment}
                key={value}
              />
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>
        <div className="commentModal-comment-write">
          <input
            type="text"
            value={CommentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            className="commentModal-comment-write_input"
            placeholder="댓글 입력..."
          />
          <button
            className="commentModal-comment-write_btn"
            onClick={addComment}
          >
            <IonIcon icon={send} className="commentModal-send-icon" />
          </button>
        </div>
      </animated.div>
    </>
  );
};

export default CommentModal;
