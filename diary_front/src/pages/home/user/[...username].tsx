import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userSearch } from "../../../api/user";
import "../profile/profile.css";

interface SearchTargetType {
  id: string;
  username: string;
  name: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [searchTarget, setSearchTarget] = useState<SearchTargetType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const Search = async () => {
      if (username) {
        const user = await userSearch(username);
        setSearchTarget(user);
      }
      setLoading(false);
    };
    Search();
  }, [username]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {loading ? (
        <p>loading...</p>
      ) : (
        <div className="profile-container">
          <h2 className="profile-title">유저 정보</h2>
          <img
            className="profile-img"
            src="https://mblogthumb-phinf.pstatic.net/MjAxODA1MDNfMjQ0/MDAxNTI1MzA5NTYwMDc1.zjtNIKShHMyj7pSbrl9iiGCCVNKpkX3sdmXz0hAEVlIg.ygl01UhsaCHIm3az4GsW7eomkFV2vWqlUl9vlAFz52Qg.JPEG.cookierun_35/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%84%EB%A0%8C%EC%A6%88%EC%BA%90%EB%A6%AD%ED%84%B0.jpg?type=w800"
            width="250px"
            alt="profile-img"
          />
          <span className="profile-name">{searchTarget?.name}</span>
          <span className="profile-username">
            <span>@{username}</span>
          </span>
          <span>{searchTarget?.email}</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
