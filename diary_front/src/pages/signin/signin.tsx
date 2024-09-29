import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import { FormEvent } from "react";
import { signin } from "../../api/user";
import { fetchCookies } from "../../api/token";
import { api } from "../../api/axiosInstance";
import { error } from "console";

function SigninPage() {
  const navigate = useNavigate();

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
      const csrftoken = await fetchCookies();
      await api
        .post(
          "/api/user/",
          {
            username: username,
            password: password,
            email: email,
            name: name,
          },
          {
            headers: {
              "X-CSRFToken": csrftoken!,
            },
          }
        )
        .then((res) => {
          if (res.status === 201) {
            navigate("/login");
          }
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-title">회원가입</h1>
      <form className="signin-form" onSubmit={submit}>
        <div className="signin-input-wrapper">
          <input
            id="id"
            name="username"
            type="text"
            className="signin-input signin-input__username"
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
        <div className="signin-input-wrapper">
          <input
            id="email"
            name="email"
            type="email"
            className="signin-input signin-input__email"
            placeholder="이메일을 입력해주세요"
            required
          />
          <button
            tabIndex={-1}
            type="button"
            className="erase-btn"
            onClick={() => removeInput("email")}
          >
            <img
              className="clear-icons"
              src="https://img.icons8.com/pastel-glyph/2x/cancel.png"
              alt="clear-icon"
            />
          </button>
        </div>
        <div className="signin-input-wrapper">
          <input
            id="name"
            name="name"
            type="text"
            className="signin-input signin-input_name"
            placeholder="이름을 입력해주세요"
            required
          />
          <button
            tabIndex={-1}
            type="button"
            className="erase-btn"
            onClick={() => removeInput("name")}
          >
            <img
              className="clear-icons"
              src="https://img.icons8.com/pastel-glyph/2x/cancel.png"
              alt="clear-icon"
            />
          </button>
        </div>
        <div className="signin-input-wrapper">
          <input
            id="password"
            name="password"
            type="password"
            className="signin-input signin-input__password"
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
        <button tabIndex={-1} type="submit" className="signin-submit">
          회원가입
        </button>
      </form>
      <Link className="backtologin" to="/login">
        계정이 존재하나요?
      </Link>
    </div>
  );
}

export default SigninPage;
