import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

function MapPage() {
  useEffect(() => {
    var mapContainer = document.getElementById("map"),
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 1, // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
          lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon);

        displayMarker(locPosition);
      });
    } else {
      var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);

      displayMarker(locPosition);
    }

    // 지도에 마커와 인포윈도우를 표시하는 함수입니다
    function displayMarker(locPosition: any) {
      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);
    }
  }, []);
  return <div id="map" style={{ width: "500px", height: "400px" }}></div>;
}

export default MapPage;
