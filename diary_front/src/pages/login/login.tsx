import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { FormEvent } from "react";
import { login } from "../../api/user";

function LoginPage() {
  const navigate = useNavigate();
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
      login(username, password, navigate);
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
            className="erase-btn"
            onClick={() => removeInput("id")}
          >
            <img
              className="clear-icons"
              src="https://img.icons8.com/pastel-glyph/2x/cancel.png"
              alt="clear-icon"
            />
          </button>
        </div>
        <div className="login-input-wrapper">
          <input
            id="password"
            name="password"
            type="password"
            className="login-input login-input__password"
            placeholder="비밀번호를 입력해주세요"
            required
          />
          <button
            tabIndex={-1}
            type="button"
            className="erase-btn"
            onClick={() => removeInput("password")}
          >
            <img
              className="clear-icons"
              src="https://img.icons8.com/pastel-glyph/2x/cancel.png"
              alt="clear-icon"
            />
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
