import { Route, Routes } from "react-router-dom";
import "./App.css";
import StartPage from "./pages/startPage/StartPage";
import LoginPage from "./pages/login/login";
import SigninPage from "./pages/signin/signin";
import HomePage from "./pages/home/home";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<StartPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signin" element={<SigninPage />}></Route>
        <Route path="/home/*" element={<HomePage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
