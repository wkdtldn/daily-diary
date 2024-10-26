import "@ionic/react/css/core.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login";
import SigninPage from "./pages/signup/signup";
import NotFound from "./pages/notfound/notfound";
import HomePage from "./pages/home/home";
import StartPage from "./pages/startPage/StartPage";
import { fetchCookies } from "./api/token";
import { api } from "./api/axiosInstance";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const initialSet = async () => {
      const csrftoken = await fetchCookies();
      api.defaults.headers.common["X-CSRFToken"] = csrftoken;
    };

    initialSet();
  }, []);
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signin" element={<SigninPage />}></Route>
        <Route path="/home/*" element={<HomePage />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
