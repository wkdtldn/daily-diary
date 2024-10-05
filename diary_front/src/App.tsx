import "@ionic/react/css/core.css";
import { IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonApp, IonContent, IonFooter } from "@ionic/react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./pages/login/login";
import SigninPage from "./pages/signin/signin";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import CalendarPage from "./pages/calendar/calendar";
import RecentPage from "./pages/recent/recent";
import WritePage from "./pages/write/write";
import ProfilePage from "./pages/profile/profile";
import UserProfile from "./pages/user/[...username]";
import NotFound from "./pages/notfound/notfound";
import { useEffect, useState } from "react";
import { check_auth } from "./api/user";
import { useRecoilState } from "recoil";
import { userState } from "./hooks/recoil/userState";
import { IonReactRouter } from "@ionic/react-router";
import ProfileEditPage from "./pages/profile-edit/profile-edit";

setupIonicReact();

function App() {
  const [user, setUser] = useRecoilState(userState);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      try {
        const auth = await check_auth();

        if (auth) {
          setUser(auth.user);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <IonApp className="app">
      {loading ? (
        <p>loading...</p>
      ) : (
        <IonReactRouter>
          <Header />
          <IonRouterOutlet style={{ position: "relative", flex: 1 }}>
            <Switch>
              <Route exact path="/calendar" component={CalendarPage}></Route>
              <Route path="/recent" component={RecentPage}></Route>
              <Route path="/write" component={WritePage}></Route>
              <Route path="/profile" component={ProfilePage}></Route>
              <Route path="/profile-edit" component={ProfileEditPage}></Route>
              <Route path="/login" component={LoginPage}></Route>
              <Route path="/signin" component={SigninPage}></Route>
              <Route path="/user/:username" component={UserProfile}></Route>
              <Route path="*" component={NotFound}></Route>
            </Switch>
          </IonRouterOutlet>
          <Footer />
        </IonReactRouter>
      )}
    </IonApp>
  );
}

export default App;
