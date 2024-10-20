import { useRecoilValue } from "recoil";
import "./profile-edit.css";

import { LoginUser } from "../../../hooks/recoil/userState";
import { useEffect, useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { api } from "../../../api/axiosInstance";
import { IoCamera } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ProfileEditPage() {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);

  const [usernameValue, setUsernameValue] = useState("");
  const [nameValue, setNameValue] = useState("");

  const [valiable, setValiable] = useState<boolean>(true);

  const [photo, setPhoto] = useState<string | undefined>(login_user.image);

  useEffect(() => {
    const FilterUsername = async () => {
      if (usernameValue) {
        if (usernameValue === login_user.username) {
          setValiable(true);
        } else {
          await api
            .get(`/api/user/check-username/${usernameValue}`)
            .then((res) => {
              if (res.data === true) {
                setValiable(false);
              } else {
                setValiable(true);
              }
            })
            .catch((error) => {
              alert(error);
            });
        }
      } else {
        setValiable(true);
      }
    };
    FilterUsername();
  }, [usernameValue]);

  const update = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data = () => {
      let submitData: Record<string, any> = {};
      if (usernameValue) {
        submitData["username"] = usernameValue;
      }
      if (nameValue) {
        submitData["name"] = nameValue;
      }
      if (photo !== login_user.image) {
        submitData["image"] = photo;
      }
      return submitData;
    };

    await api.patch(`/api/user/update/${login_user.id}`, data());
    navigate("/home/profile");
    window.history.go(0);
  };

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    setPhoto(image.dataUrl);
  };

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-img__wrapper">
        <img className="profile-edit-img" src={photo} alt="profile-edit-img" />
        <button
          className="profile-edit-img__capture"
          color="secondary"
          onClick={() => takePicture()}
        >
          <IoCamera size={22} color="white" />
        </button>
      </div>
      <div className="profile-edit-input__wrapper">
        <input
          value={usernameValue}
          onChange={(e) => setUsernameValue(e.target.value)}
          name="username"
          type="text"
          className="profile-edit-input"
          maxLength={40}
          placeholder={`아이디 (${login_user.username})`}
        />
        {!valiable ? (
          <label className="profile-edit-label">
            사용할 수 없는 아이디입니다.
          </label>
        ) : (
          false
        )}
      </div>
      <input
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        type="text"
        name="name"
        className="profile-edit-input"
        placeholder={`이름 (${login_user.name})`}
      />
      <button
        type="submit"
        className="UpdateBtn"
        style={{ marginTop: "50px" }}
        onClick={(e) => update(e)}
      >
        수정하기
      </button>
    </div>
  );
}

export default ProfileEditPage;
