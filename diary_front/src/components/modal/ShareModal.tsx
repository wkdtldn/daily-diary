import "./ShareModal.css";

import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
} from "react-share";
import { IonIcon } from "@ionic/react";
import {
  checkmarkOutline,
  clipboardOutline,
  ellipsisHorizontalOutline,
  logoInstagram,
} from "ionicons/icons";
import { RiKakaoTalkFill } from "react-icons/ri";
import { userSearch } from "../../api/user";
import { ClockLoader } from "react-spinners";

declare global {
  interface Window {
    Kakao: any;
  }
}

type TargetUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  image: string;
  followings: string[];
  followers: string[];
  following: boolean;
};

interface ShareModalProps {
  writer: string;
  date: Date;
  like_count: number;
  comment_count: number;
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  writer,
  date,
  like_count,
  comment_count,
  isOpen,
  onClose,
}) => {
  const [targetUser, setTargetUser] = useState<TargetUser>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initSet = async () => {
      setLoading(true);
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("052bba89c10ab91b90b2d5d65051c5e7");
      } else {
      }
      const user = await userSearch(writer);
      setTargetUser(user);
      setLoading(false);
    };
    initSet();
  }, []);

  const animation = useSpring({
    transform: isOpen ? `translateY(67%)` : `translateY(167%)`,
    opacity: 1,
  });

  const overlay_animation = useSpring({
    display: isOpen ? "block" : "none",
    opacity: isOpen ? 0.3 : 0,
  });

  const shareData = {
    title: `Daily Diary`,
    text: `@${writer}님의 이야기를 들어보세요!`,
    url: "https://d-diary.netlify.app" + window.location.pathname,
  };

  const InstagramShare = () => {
    const shareUrl = `https://www.instagram.com/?url=${shareData.url}`;
    window.open(shareUrl, "_blank");
  };

  const kakaoShare = () => {
    if (targetUser) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "Daily Diary",
          description: shareData.text,
          // 앱 아이콘
          imageUrl:
            "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
          link: {
            mobileWebUrl: shareData.url,
            webUrl: shareData.url,
          },
        },
        itemContent: {
          profileText: `@${targetUser.username}`,
          profileImageUrl: targetUser.image,
          titleImageUrl: targetUser.image,
          titleImageText: targetUser.username,
          titleImageCategory: targetUser.name,
        },
        social: {
          likeCount: like_count,
          commentCount: comment_count,
          // sharedCount: 30,
        },
        buttons: [
          {
            title: "웹으로 이동",
            link: {
              mobileWebUrl: shareData.url,
              webUrl: shareData.url,
            },
          },
          {
            title: "앱으로 이동",
            link: {
              mobileWebUrl: shareData.url,
              webUrl: shareData.url,
            },
          },
        ],
      });
    }
  };

  const share = async () => {
    try {
      await navigator.share(shareData);
    } catch (err) {}
  };

  const [showCopy, setShowCopy] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  const CopyModalAnimation = useSpring({
    transform: showCopy ? "translateY(30%)" : "translateY(-100%)",
    config: { tension: 170, friction: 26 },
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setShowCopy(true);
      setIsCopy(true);
      setTimeout(() => {
        setShowCopy(false);
      }, 2500);
    } catch (error) {
      console.error(error);
    }
  };

  const shareRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (shareRef.current) {
      shareRef.current.scrollLeft += event.deltaY;
    }
  };

  return (
    <>
      <animated.div
        style={overlay_animation}
        className="ShareModalOverlay"
        onClick={onClose}
      ></animated.div>
      <animated.div style={animation} className="ShareModal">
        <div className="ShareModal-header">
          <h2>공유하기</h2>
        </div>
        <>
          {loading ? (
            <ClockLoader />
          ) : (
            <>
              <div className="sharemodal-body">
                <div className="sharemodal-body_header">
                  <div className="sharemodal-app_profile">
                    <img
                      className="sharemodal_app-icon"
                      src="https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg"
                      alt="app-icon"
                    />
                  </div>
                  <div className="sharemodal-info">
                    <span className="sharemodal-title">Daily Diary</span>
                    <span className="sharemodal-description">
                      {date.getFullYear()}년 {date.getMonth() + 1}월{" "}
                      {date.getDate()}일 | @{writer}님의 일기
                    </span>
                  </div>
                </div>
                <div className="sharemodal-line"></div>

                <h3 style={{ width: "100%", paddingLeft: "10px" }}>
                  다른 옵션 보기
                </h3>
                <div
                  ref={shareRef}
                  onWheel={handleWheel}
                  className="sharemodal_share-btn_wrapper"
                >
                  <FacebookShareButton
                    className="share-btn"
                    url={shareData.url}
                    title={shareData.title}
                  >
                    <FacebookIcon size={75} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    className="share-btn"
                    url={shareData.url}
                    title={shareData.title}
                  >
                    <TwitterIcon size={75} />
                  </TwitterShareButton>
                  <LineShareButton
                    className="share-btn"
                    url={shareData.url}
                    title={shareData.title}
                  >
                    <LineIcon size={75} />
                  </LineShareButton>
                  <button
                    className="share-btn share-other share_instagram"
                    onClick={() => InstagramShare()}
                  >
                    <IonIcon icon={logoInstagram} />
                  </button>
                  <button
                    className="share-btn share-other share_kakao"
                    onClick={kakaoShare}
                  >
                    <RiKakaoTalkFill />
                  </button>
                  <button className="share-btn share-other" onClick={share}>
                    <IonIcon icon={ellipsisHorizontalOutline} />
                  </button>
                </div>
              </div>
              <div className="sharemodal-other_wrapper">
                <button className="sharemodal-copy_btn" onClick={copy}>
                  {isCopy ? (
                    <>
                      <span>복사 완료</span>
                      <IonIcon
                        className="sharemodal-copy_icon"
                        icon={checkmarkOutline}
                      />
                    </>
                  ) : (
                    <>
                      <span>복사</span>
                      <IonIcon
                        className="sharemodal-copy_icon"
                        icon={clipboardOutline}
                      />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </>
      </animated.div>
      <div
        style={{
          width: "100%",
          height: "auto",
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000000,
          top: 0,
          left: 0,
        }}
      >
        <animated.div className="copy-alert" style={CopyModalAnimation}>
          <span className="copy-alert_check">
            <IonIcon icon={checkmarkOutline} />
          </span>
          클립보드에 복사되었습니다!
        </animated.div>
      </div>
    </>
  );
};

export default ShareModal;
