import { useEffect, useState } from "react";
import "./friend.css";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { userSearch } from "../../../api/user";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import FriendComponent from "../../../components/modal/FriendContent";
import { SyncLoader } from "react-spinners";

type Friend = {
  id: number;
  username: string;
  name: string;
  image_url: string;
  following: boolean;
  isActive: boolean;
  last_active: string | null;
};

function FriendPage() {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);

  const [Friends, setFriends] = useState<Friend[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load_friend = async () => {
      setLoading(true);
      let friend_list = Array.from(
        new Set([...login_user.followers, ...login_user.followings])
      );

      friend_list.forEach(async (username, index) => {
        const user = (await userSearch(username)) as Friend;
        await api.get(`/api/check-status/${user.id}`).then((res) => {
          if (res.status === 200) {
            const data = res.data;
            setFriends((prevFriends) => [
              ...prevFriends,
              { ...user, isActive: data.status },
            ]);
          }
        });
      });
      console.log(friend_list);
      setLoading(false);
    };
    load_friend();
  }, []);

  return (
    <>
      <div className="m-w m-h flex flex-c a-c p-10 overy-a">
        {Friends.length === 0 ? (
          <div className="m-w m-h flex a-c j-c">
            <h3>팔로우, 팔로잉을 하면 여기에 표시됩니다</h3>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="m-w m-h flex a-c j-c">
                <SyncLoader />
              </div>
            ) : (
              <>
                {Friends.map((friend, index) => (
                  <div className="m-w" style={{ height: "75px" }}>
                    <FriendComponent
                      friend={friend}
                      handleFriendState={setFriends}
                      navigate={navigate}
                      key={index}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default FriendPage;
