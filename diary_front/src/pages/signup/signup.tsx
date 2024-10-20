import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { FormEvent, useState } from "react";
import { api } from "../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close, eye, eyeOff } from "ionicons/icons";

function SignupPage() {
  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState(false);

  const removeInput = (tag: string): void => {
    let target = document.getElementById(tag) as HTMLInputElement;
    if (target) {
      target.value = "";
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData: FormData = new FormData(e.currentTarget);

    let username = formData.get("username") as string;
    let password = formData.get("password") as string;
    let name = formData.get("name") as string;
    let email = formData.get("email") as string;

    if (username && password && name && email) {
      await api
        .post("/api/signup/", {
          username: username,
          password: password,
          email: email,
          name: name,
        })
        .then((res) => {
          if (res.status === 201) {
            alert("회원가입이 성공적으로 완료되었습니다.");
            navigate("/login");
          }
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <form className="signup-form" onSubmit={submit}>
        <div className="signup-input-wrapper">
          <input
            id="id"
            name="username"
            type="text"
            className="signup-input signup-input__username"
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
        <div className="signup-input-wrapper">
          <input
            id="email"
            name="email"
            type="email"
            className="signup-input signup-input__email"
            placeholder="이메일을 입력해주세요"
            required
          />
          <button
            tabIndex={-1}
            type="button"
            className="input-btn close-btn"
            onClick={() => removeInput("email")}
          >
            <IonIcon icon={close} />
          </button>
        </div>
        <div className="signup-input-wrapper">
          <input
            id="name"
            name="name"
            type="text"
            className="signup-input signup-input_name"
            placeholder="이름을 입력해주세요"
            required
          />
          <button
            tabIndex={-1}
            type="button"
            className="input-btn close-btn"
            onClick={() => removeInput("name")}
          >
            <IonIcon icon={close} />
          </button>
        </div>
        <div className="signup-input-wrapper">
          <input
            id="password"
            name="password"
            type={`${passwordShow ? "text" : "password"}`}
            className="signup-input login-input__password"
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
        <button tabIndex={-1} type="submit" className="signup-submit">
          회원가입
        </button>
      </form>
      <Link className="backtologin" to="/login">
        계정이 존재하나요?
      </Link>
    </div>
  );
}

export default SignupPage;
