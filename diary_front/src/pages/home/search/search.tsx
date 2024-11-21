import { IonIcon } from "@ionic/react";
import { api } from "../../../api/axiosInstance";
import "./search.css";

import React, { useEffect, useState } from "react";
import { close, search } from "ionicons/icons";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

type User = {
  id: number;
  image_url: string;
  username: string;
  name: string;
  followers: string[];
};

interface SearchResultProps {
  id: number;
  image_url: string;
  username: string;
  name: string;
  followers: string[];
}

const SearchResult: React.FC<SearchResultProps> = ({
  id,
  image_url,
  username,
  name,
  followers,
}) => {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);
  const [isFollow, setIsFollow] = useState(
    login_user.username !== username
      ? followers.includes(login_user.username)
      : null
  );

  const follow = async () => {
    if (isFollow) {
      await api.delete(`/api/follow/${id}/unfollow/`);
      setIsFollow(false);
    } else {
      await api.post(`/api/follow/`, { following: id });
      setIsFollow(true);
    }
  };

  return (
    <>
      <div
        className="m-w flex a-c pl-5 pr-5 mb-10"
        style={{ height: "65px" }}
        onClick={() => navigate(`/home/user/${username}`)}
      >
        <div className="flex a-c j-c">
          <img
            src={image_url}
            alt="user-profile"
            className="over-h round"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
        </div>
        <div className="f-1 flex j-c flex-c ml-10">
          <span className="bold">{username}</span>
          <span className="bold" style={{ color: "rgb(160,160,160)" }}>
            {name}
          </span>
        </div>
        <div>
          {isFollow !== null && (
            <button
              className="border-n"
              style={{
                width: "100px",
                height: "40px",
                fontSize: "15px",
                color: "white",
                borderRadius: "10px",
                backgroundColor: "rgb(94, 94, 255)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                follow();
              }}
            >
              {isFollow ? "팔로우 취소" : "팔로우"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

function SearchPage() {
  const [keyWord, setKeyWord] = useState<string>("");
  const [result, setResult] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const load_data = async () => {
    setLoading(true);
    const res = await api.get(`/api/search/${keyWord}/`);
    if (res.data.length !== 0) {
      setResult(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (keyWord) {
      load_data();
    } else {
      setResult([]);
    }
  }, [keyWord]);

  return (
    <>
      <div className="m-w m-h flex flex-c a-c pl-10 pr-10">
        <div
          className="search-bar over-h mt-10 pl-10 pr-10 relative flex a-c"
          style={{
            border: "1.3px solid rgb(203,203,203)",
            borderRadius: "10px",
          }}
        >
          <label
            className="flex mr-5"
            style={{ fontSize: "18px", color: "gray" }}
          >
            <IonIcon icon={search} />
          </label>

          <input
            type="text"
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            className="border-n flex m-h m-w"
            placeholder="검색할 내용 입력..."
            style={{ fontSize: "16px", color: "gray" }}
          />
          {keyWord && (
            <label
              className="flex ml-5"
              style={{ fontSize: "18px", color: "gray" }}
              onClick={() => setKeyWord("")}
            >
              <IonIcon icon={close} />
            </label>
          )}
        </div>
        <div className="m-w m-h overy-a mt-10">
          {loading ? (
            <div className="m-w m-h flex a-c j-c">
              <SyncLoader />
            </div>
          ) : (
            <>
              {result.length !== 0 ? (
                result.map((user, index) => (
                  <SearchResult
                    id={user.id}
                    username={user.username}
                    name={user.name}
                    image_url={user.image_url}
                    followers={user.followers}
                    key={index}
                  />
                ))
              ) : (
                <div className="m-w m-h flex a-c j-c">
                  <h3>검색 결과는 여기 나옵니다</h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage;
