import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import axios from "axios";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Layout from "../components/layout/Layout";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ol.Map | null>(null);
  const [poiList, setPoiList] = useState<any[]>([]); // 천문대 목록 저장
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const apiKey = process.env.GATSBY_VWORLD_API_KEY;

  useEffect(() => {
    const baseLayer = new TileLayer({
      source: new XYZ({
        url: `http://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/{z}/{y}/{x}.png`,
      }),
    });

    const map = new ol.Map({
      target: mapRef.current!,
      layers: [baseLayer],
      view: new View({
        center: [14217020.306437293, 4480534.687684822],
        zoom: 8,
      }),
    });
    mapInstanceRef.current = map;
    // 사용자 위치 가져오기
    fetchUserLocation(map);

    // 천문대 데이터 가져오기
    fetchObservatories(map);
  }, []);

  const fetchUserLocation = (map: ol.Map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = fromLonLat([longitude, latitude]);
          setUserLocation([longitude, latitude]);

          // 사용자 위치 마커 추가
          const userMarker = new Feature({
            geometry: new Point(coords),
          });
          userMarker.setStyle(
            new Style({
              image: new Icon({
                src: "https://cdn-icons-png.flaticon.com/512/3219/3219617.png", // 사용자 아이콘
                scale: 0.07,
              }),
            })
          );

          const vectorLayer = new VectorLayer({
            source: new VectorSource({
              features: [userMarker],
            }),
          });
          map.addLayer(vectorLayer);

          // 지도 중심을 사용자 위치로 이동
          map.getView().setCenter(coords);
          map.getView().setZoom(12);
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  };

  const fetchObservatories = async (map: ol.Map) => {
    const results = [];
    let currentPage = 1;

    while (true) {
      try {
        const response = await axios.get(
          `/api/req/search?key=${apiKey}&domain=http://localhost:3000&service=search&request=search&version=2.0&query=천문대&type=PLACE&format=json&page=${currentPage}`
        );

        const items = response.data.response.result.items;

        console.log(`페이지 ${currentPage} 응답 데이터:`, items);

        if (!items || items.length === 0) break; // 더 이상 데이터가 없으면 종료

        results.push(...items);

        const totalPages = response.data.response.page.total;
        if (currentPage >= totalPages) break; // 모든 페이지를 가져왔으면 종료
        currentPage += 1; // 다음 페이지로 이동
      } catch (error) {
        console.error("천문대 데이터 가져오기 실패:", error);
        break;
      }
    }

    console.log("전체 천문대 데이터:", results);

    setPoiList(results); // 데이터 저장
    displayObservatoriesOnMap(results, map); // 지도에 표시
  };
//   const fetchObservatories = async (map: ol.Map) => {
//     const results = [];
//     let currentPage = 1;
  
//     while (true) {
//       try {
//         const response = await axios.get(
//           `/api/req/search?key=${apiKey}&domain=http://localhost:3000&service=search&request=search&version=2.0&query=천문대&type=PLACE&format=json&page=${currentPage}`
//         );
  
//         const items = response?.data?.response?.result?.items;
  
//         console.log(`페이지 ${currentPage} 응답 데이터:`, items);
  
//         if (!items || items.length === 0) break; // 더 이상 데이터가 없으면 종료
  
//         // 카테고리 기반 필터링
//         const filteredItems = items.filter((item: any) => {
//           const category = item.category || "";
//           return (
//             category.includes("교육부") || // 중앙행정기관 > 교육부
//             category.includes("체험관광지") // 테마관광지 > 체험관광지
//           );
//         });
  
//         results.push(...filteredItems);
  
//         const totalPages = response.data.response.page.total;
//         if (currentPage >= totalPages) break; // 모든 페이지를 가져왔으면 종료
//         currentPage += 1; // 다음 페이지로 이동
//       } catch (error) {
//         console.error("천문대 데이터 가져오기 실패:", error);
//         break;
//       }
//     }
  
//     console.log("전체 천문대 데이터:", results);
  
//     setPoiList(results); // 필터링된 데이터 저장
//     displayObservatoriesOnMap(results, map); // 지도에 표시
//   };
  

  const displayObservatoriesOnMap = (observatories: any[], map: ol.Map) => {
    const features = observatories.map((obs: any) => {
      try {
        const coords = fromLonLat([
          parseFloat(obs.point.x),
          parseFloat(obs.point.y),
        ]);
        console.log("천문대 좌표:", { title: obs.title, coords });

        const feature = new Feature({
          geometry: new Point(coords),
          name: obs.title,
        });
        feature.setStyle(
          new Style({
            image: new Icon({
              src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", // 별 모양 아이콘
              scale: 0.07,
            }),
          })
        );
        return feature;
      } catch (error) {
        console.error("좌표 변환 오류:", obs, error);
        return null;
      }
    });

    const validFeatures = features.filter(
      (f): f is Feature<Point> => f !== null
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: validFeatures,
      }),
    });
    map.addLayer(vectorLayer);
  };

  const handlePoiClick = (poi: any) => {
    if (!mapInstanceRef.current) return;

    const coords = fromLonLat([
      parseFloat(poi.point.x),
      parseFloat(poi.point.y),
    ]);
    mapInstanceRef.current.getView().setCenter(coords);
    mapInstanceRef.current.getView().setZoom(15); // 선택한 천문대 중심 확대
  };

  return (
    <Layout title="천문대">
      <div>
        <div ref={mapRef} style={{ width: "100%", height: "500px" }}></div>
        <div>
          {userLocation && (
            <p>
              사용자의 위치: 위도 {userLocation[1]}, 경도 {userLocation[0]}
            </p>
          )}
        </div>
        <div>
          <h3>천문대 목록</h3>
          <ul>
            {poiList.map((poi, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePoiClick(poi)}
                  style={{
                    background: "none",
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    margin: "5px 0",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  {poi.title} ({poi.address.road || poi.address.parcel})
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default MapComponent;
