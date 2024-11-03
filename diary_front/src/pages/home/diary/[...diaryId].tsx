import "./diary.css";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiary } from "../../../api/diary";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { api } from "../../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close, send, shareSocialOutline } from "ionicons/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { TfiComment, TfiCommentAlt } from "react-icons/tfi";
import { useSpring, animated } from "@react-spring/web";
import Comment from "../../../components/Comment/Comment";
import { Link } from "react-router-dom";
import Dompurify from "dompurify";
import RemoveComponent from "../../../components/modal/question/Remove";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Rectangle,
  Legend,
  PieChart,
  Pie,
  Cell,
  Sector,
  PieProps,
} from "recharts";

type probsPiece = {
  name: string;
  pv: number;
};

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
  emotion: number | null;
  probs: probsPiece[] | [];
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
                load_comment={load_comment}
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

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    name,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={16}
      >
        {name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={13}
      >
        {`(확률 : ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

function DiaryPage() {
  const modalRef = useRef<HTMLDialogElement>(null);

  const navigate = useNavigate();

  const { diaryId } = useParams<{ diaryId: string }>();

  const [loading, setLoading] = useState<boolean>(false);

  const [diary, setDiary] = useState<Diary | null>(null);

  const login_user = useRecoilValue(LoginUser);

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

  const [selectOpen, setSelectOpen] = useState<boolean>(false);

  const DeleteOptionAnimation = useSpring({
    borderRadius: "0px 0px 7px 7px",
    width: selectOpen ? "80px" : "0px",
    height: selectOpen ? "30px" : "0px",
    transform: selectOpen
      ? "translateY(220%) translateX(0%)"
      : "translateY(0%) translateX(-100%)",
    opacity: selectOpen ? 1 : 0,
    pointerEvents: selectOpen ? "auto" : "none",
  });
  const EditOptionAnimation = useSpring({
    borderRadius: "7px 7px 0px 0px",
    width: selectOpen ? "80px" : "0px",
    height: selectOpen ? "30px" : "0px",
    transform: selectOpen
      ? "translateY(120%) translateX(0%)"
      : "translateY(0%) translateX(-100%)",
    opacity: selectOpen ? 1 : 0,
    pointerEvents: selectOpen ? "auto" : "none",
  });

  const [pieIndexState, setPieIndexState] = useState(0);
  const onPieEnter = (_: any, index: number) => {
    setPieIndexState(index);
  };

  const [chartOption, setChartOption] = useState(1);

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
            {login_user.username === diary.writer_name ? (
              <>
                <div className="diary-option">
                  <button
                    className="diary-option_btn"
                    onClick={() => setSelectOpen(!selectOpen)}
                  >
                    <HiOutlineDotsVertical />
                  </button>
                </div>
                <animated.button
                  style={{
                    ...EditOptionAnimation,
                    pointerEvents: EditOptionAnimation.opacity.to((opacity) =>
                      opacity === 0 ? "none" : "auto"
                    ),
                  }}
                  className="diary-option_select"
                >
                  수정
                </animated.button>
                <animated.button
                  style={{
                    ...DeleteOptionAnimation,
                    pointerEvents: DeleteOptionAnimation.opacity.to((opacity) =>
                      opacity === 0 ? "none" : "auto"
                    ),
                  }}
                  className="diary-option_select"
                  onClick={() => modalRef.current?.showModal()}
                >
                  삭제
                </animated.button>
              </>
            ) : (
              <></>
            )}
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
          <RemoveComponent
            diary_id={diaryId!}
            navigate={navigate}
            modalRef={modalRef}
          />
          {diary.emotion ? (
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="diary-result-header">
                <button
                  className="chart-controler"
                  onClick={() => setChartOption(0)}
                >
                  &lt;
                </button>
                <h3>감정분석 결과</h3>
                <button
                  className="chart-controler"
                  onClick={() => setChartOption(1)}
                >
                  &gt;
                </button>
              </div>
              <br />
              {chartOption ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    width={500}
                    height={300}
                    data={diary.probs}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`확률 : ${value}`]} />
                    <Bar
                      dataKey="pv"
                      fill="#8884d8"
                      activeBar={<Rectangle fill="yellow" stroke="blue" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={diary.probs}
                      dataKey="pv"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      activeIndex={pieIndexState}
                      activeShape={renderActiveShape}
                      onMouseEnter={onPieEnter}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <p>존재하지 않는 일기입니다.</p>
      )}
    </div>
  );
}

export default DiaryPage;
