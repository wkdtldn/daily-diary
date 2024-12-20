import "./diary.css";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiary } from "../../../api/diary";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { api } from "../../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { TfiComment, TfiCommentAlt } from "react-icons/tfi";
import { useSpring, animated } from "@react-spring/web";
import { Link } from "react-router-dom";
import Dompurify from "dompurify";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Rectangle,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import CommentModal from "../../../components/modal/CommentModal";
import ShareModal from "../../../components/modal/ShareModal";

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
  emotion: number | null;
  probs: probsPiece[] | [];
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
  const navigate = useNavigate();

  const { diaryId } = useParams<{ diaryId: string }>();

  const [loading, setLoading] = useState<boolean>(false);

  const [diary, setDiary] = useState<Diary | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);

  const login_user = useRecoilValue(LoginUser);

  const [commentShow, setCommentShow] = useState<boolean>(false);
  const [ShareShow, setShareShow] = useState<boolean>(false);

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
      navigate("/home");
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

  const [like, setLike] = useState<boolean | undefined>(
    diary?.likes.includes(login_user.username)
  );

  const diary_like = async () => {
    await api.post(`/api/diary/like/${diaryId}/`, {}).then((res) => {
      setLike(res.data);
    });
  };

  const delete_diary = async () => {
    const res = window.confirm(
      "일기를 삭제하실 경우 다시 복구할 수 없습니다.\n정말 삭제하시겠습니까?"
    );
    if (res) {
      await api.delete(`/api/diary/delete/${diaryId}/`).then((res) => {
        if (res.status === 204) {
          navigate("/home");
        }
      });
    } else {
    }
  };

  const count_comment = async () => {
    const res = await api.get(`/api/comments/${diaryId}`);
    if (res.status === 200) {
      setCommentCount(res.data.length);
    }
  };

  return (
    <>
      <div className="m-w m-h flex flex-c a-c j-fs overy-a">
        {loading ? (
          <p>loading</p>
        ) : diary !== null ? (
          <div className="m-w h-a flex flex-c a-c">
            <div className="diary-header m-w flex a-c j-fs">
              <span>{diary.date}</span>
              <Link
                className="diary_writer sumtext"
                to={`/home/user/${diary.writer_name}`}
              >
                @{diary.writer_name}
              </Link>
              {login_user.username === diary.writer_name ? (
                <>
                  <div className="f-1 flex j-fe pr-10">
                    <button
                      className="border-n flex a-c j-c bg-n"
                      style={{
                        width: "35px",
                        height: "35px",
                        fontSize: "18px",
                      }}
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
                    className="diary-option_select absolute ta-c bold border-n"
                    onClick={() => navigate(`/home/diary/edit/${diaryId}`)}
                  >
                    수정
                  </animated.button>
                  <animated.button
                    style={{
                      ...DeleteOptionAnimation,
                      pointerEvents: DeleteOptionAnimation.opacity.to(
                        (opacity) => (opacity === 0 ? "none" : "auto")
                      ),
                    }}
                    className="diary-option_select absolute ta-c bold border-n"
                    onClick={delete_diary}
                  >
                    삭제
                  </animated.button>
                </>
              ) : (
                <></>
              )}
            </div>
            <div
              className="diary-body m-w overy-a"
              dangerouslySetInnerHTML={{
                __html: Dompurify.sanitize(diary.content),
              }}
            ></div>
            <div className="diary-footer m-w">
              <div className="communicate-container m-w m-h flex a-c j-se pr-5">
                <span className="communicate-like_count f-1">
                  좋아요{" "}
                  {diary.likes.includes(login_user.username)
                    ? !like
                      ? diary.like_count - 1
                      : diary.like_count
                    : like
                    ? diary.like_count + 1
                    : diary.like_count}
                  개
                </span>
                <button
                  className="communicate-btn border-n bg-n flex a-c j-c"
                  onClick={diary_like}
                >
                  {like ? <IoIosHeart /> : <IoIosHeartEmpty />}
                </button>
                <button
                  className="communicate-btn border-n bg-n flex a-c j-c"
                  onClick={() => setCommentShow(!commentShow)}
                >
                  {commentShow ? (
                    <TfiCommentAlt id="comment" />
                  ) : (
                    <TfiComment id="comment" />
                  )}
                </button>
                <button
                  className="communicate-btn border-n bg-n flex a-c j-c"
                  onClick={() => {
                    count_comment();
                    setShareShow(!ShareShow);
                  }}
                >
                  <IonIcon icon={shareSocialOutline} />
                </button>
              </div>
            </div>
            {diary.emotion !== null ? (
              <div className="m-w h-a flex flex-c a-c j-c">
                <div className="m-w flex a-c j-se" style={{ height: "55px" }}>
                  <button
                    className="chart-controler flex a-c j-c bold border-n bg-n"
                    onClick={() => setChartOption(0)}
                  >
                    &lt;
                  </button>
                  <h3>감정분석 결과</h3>
                  <button
                    className="chart-controler flex a-c j-c bold border-n bg-n"
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
      <CommentModal
        isOpen={commentShow}
        onClose={() => setCommentShow(false)}
        diary_id={diaryId!}
      />
      {diary && (
        <ShareModal
          writer={diary.writer_name}
          date={new Date(diary.date)}
          like_count={diary.like_count}
          comment_count={commentCount}
          isOpen={ShareShow}
          onClose={() => setShareShow(false)}
        />
      )}
    </>
  );
}

export default DiaryPage;
