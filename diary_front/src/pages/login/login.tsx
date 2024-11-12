import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { FormEvent, useState } from "react";
import { api } from "../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close, eye, eyeOff } from "ionicons/icons";

function LoginPage() {
  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState(false);

  const removeInput = (tag: string): void => {
    let target = document.getElementById(tag) as HTMLInputElement;
    if (target) {
      target.value = "";
      target.focus();
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData: FormData = new FormData(e.currentTarget);

    let username = formData.get("username") as string;
    let password = formData.get("password") as string;

    if (username && password) {
      await api
        .post("/api/login/", {
          username: username,
          password: password,
        })
        .then((res) => {
          if (res.status === 200) {
            navigate("/home");
          } else if (res.status === 400) {
            alert("존재하지 않는 아이디입니다. 회원가입을 먼저 진행해주세요.");
          }
        })
        .catch((error) => {
          alert("존재하지 않는 아이디입니다. 회원가입을 먼저 진행해주세요.");
        });
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>
      <form className="login-form" onSubmit={submit}>
        <div className="login-input-wrapper">
          <input
            id="id"
            name="username"
            type="text"
            className="login-input login-input__username"
            placeholder="아이디를 입력해주세요"
            required
          />
          <button
            tabIndex={-1}
            type="button"
            className="input-btn close-btn"
            onClick={() => removeInput("id")}
          >
            <IonIcon icon={close} />
          </button>
        </div>
        <div className="login-input-wrapper">
          <input
            id="password"
            name="password"
            type={`${passwordShow ? "text" : "password"}`}
            className="login-input login-input__password"
            placeholder="비밀번호를 입력해주세요"
            required
          />
          <button
            tabIndex={-1}
            type="button"
            className="input-btn"
            onClick={() => setPasswordShow(!passwordShow)}
          >
            {passwordShow ? <IonIcon icon={eye} /> : <IonIcon icon={eyeOff} />}
          </button>
        </div>
        <button type="submit" className="login-submit">
          로그인
        </button>
      </form>
      <div className="options">
        <Link to="/signin">회원가입</Link>
        <Link to="/lost">비밀번호를 잃어버리셨나요?</Link>
      </div>
    </div>
  );
}

export default LoginPage;
