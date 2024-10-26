import "./diary.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiary } from "../../../api/diary";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { api } from "../../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close, send, shareSocialOutline } from "ionicons/icons";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { TfiComment, TfiCommentAlt } from "react-icons/tfi";
import { useSpring, animated } from "@react-spring/web";
import Comment from "../../../components/Comment/Comment";
import { Link } from "react-router-dom";
import Dompurify from "dompurify";

type Diary = {
  id: string;
  writer_name: string;
  text: string;
  content: string;
  like_count: number;
  likes: string[];
  time: string;
  writer: number;
  date: string;
  images: string[];
};

type Comment = {
  id: number;
  writer_name: string;
  diary: string;
  like_count: number;
  created_at: string;
  comment: string;
  likes: string[];
};

interface CommunicateComponentProps {
  diary_id: string;
  like_count: number;
  like_list: string[];
}

const CommunicateComponent: React.FC<CommunicateComponentProps> = ({
  diary_id,
  like_count,
  like_list,
}) => {
  const login_user = useRecoilValue(LoginUser);

  const [CommentValue, setCommentValue] = useState<string>("");

  const [like, setLike] = useState<boolean>(
    like_list.includes(login_user.username)
  );

  const [commentShow, setCommentShow] = useState<boolean>(false);

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
    if (commentShow) {
      load_comment();
    }
  }, [commentShow]);

  const animation = useSpring({
    transform: commentShow
      ? `translateY(25%) translateX(-5px)`
      : `translateY(125%) translateX(-5px)`,
    opacity: commentShow ? 1 : 0,
  });

  const overlay_animation = useSpring({
    display: commentShow ? "block" : "none",
    opacity: commentShow ? 0.6 : 0,
    backgroundColor: commentShow ? "black" : "rgba(0,0,0,0)",
  });

  const diary_like = async () => {
    await api.post(`/api/diary/like/${diary_id}/`, {}).then((res) => {
      setLike(res.data);
    });
  };

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
    <div className="communicate-container">
      <span className="communicate-like_count">
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
      <button className="communicate-like communicate-btn" onClick={diary_like}>
        {like ? <IoIosHeart /> : <IoIosHeartEmpty />}
      </button>
      <button
        className="communicate-comment communicate-btn"
        onClick={() => setCommentShow(!commentShow)}
      >
        {commentShow ? (
          <TfiCommentAlt id="comment" />
        ) : (
          <TfiComment id="comment" />
        )}
      </button>
      <button className="communicate-share communicate-btn">
        <IonIcon icon={shareSocialOutline} />
      </button>
      <animated.div
        style={overlay_animation}
        className="commentModalOverlay"
        onClick={() => setCommentShow(false)}
      ></animated.div>
      <animated.div style={animation} className="commentModal">
        <div className="modal-header">
          <span>댓글</span>
          <button
            className="modal-cancel"
            onClick={() => setCommentShow(false)}
          >
            <IonIcon icon={close} />
          </button>
        </div>
        <div className="modal-body">
          {comments ? (
            comments.map((comment, value) => (
              <Comment
                id={comment.id}
                writer={comment.writer_name}
                comment={comment.comment}
                created_at={comment.created_at}
                like_count={comment.like_count}
                like_list={comment.likes}
                key={value}
              />
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>
        <div className="modal-comment-write">
          <input
            type="text"
            value={CommentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            className="modal-comment-write_input"
            placeholder="댓글 입력..."
          />
          <button className="modal-comment-write_btn" onClick={addComment}>
            <IonIcon icon={send} className="modal-send-icon" />
          </button>
        </div>
      </animated.div>
    </div>
  );
};

function DiaryPage() {
  const navigate = useNavigate();

  const { diaryId } = useParams<{ diaryId: string }>();

  const [loading, setLoading] = useState<boolean>(false);

  const [diary, setDiary] = useState<Diary | null>(null);

  useState(() => {
    setLoading(true);
    if (diaryId) {
      const searchDiary = async () => {
        const data = await getDiary(diaryId);
        setDiary(data);
        setLoading(false);
      };
      searchDiary();
    } else {
      alert("잘못된 주소입니다.");
      navigate("/home/calendar");
    }
  });

  return (
    <div className="diary-container">
      {loading ? (
        <p>loading</p>
      ) : diary !== null ? (
        <div className="diary-wrapper">
          <div className="diary-header">
            <span>{diary.date}</span>
            <Link
              className="diary_writer"
              to={`/home/user/${diary.writer_name}`}
            >
              @{diary.writer_name}
            </Link>
          </div>
          <div
            className="diary-body"
            dangerouslySetInnerHTML={{
              __html: Dompurify.sanitize(diary.content),
            }}
          ></div>
          <div className="diary-footer">
            <CommunicateComponent
              diary_id={diary.id}
              like_count={diary.like_count}
              like_list={diary.likes}
            />
          </div>
        </div>
      ) : (
        <p>존재하지 않는 일기입니다.</p>
      )}
    </div>
  );
}

export default DiaryPage;
