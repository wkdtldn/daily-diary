import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export function Map() {
  useEffect(() => {
    const loadKakaoMap = () => {
      const existingScript = document.querySelector(
        `script[src*="dapi.kakao.com"]`
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=052bba89c10ab91b90b2d5d65051c5e7&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          window.kakao.maps.load(() => {
            const container = document.getElementById("map");
            const options = {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도 중심좌표
              level: 3, // 확대 수준
            };

            if (container) {
              new window.kakao.maps.Map(container, options); // 지도 생성
            }
          });
        };

        script.onerror = () => {
          console.error("Failed to load the Kakao Maps API script.");
        };
      }
    };

    if (!window.kakao) {
      loadKakaoMap();
    } else {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      if (container) {
        new window.kakao.maps.Map(container, options);
      }
    }
  }, []);

  return <div id="map" style={{ width: "500px", height: "400px" }}></div>;
}
