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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedPoiList, setSortedPoiList] = useState<any[]>([]);

  const apiKey = process.env.GATSBY_VWORLD_API_KEY;
  const itemsPerPage = 10;

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

    fetchUserLocation(map);
    fetchObservatories(map);
  }, []);

  const fetchUserLocation = (map: ol.Map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = fromLonLat([longitude, latitude]);
          setUserLocation([longitude, latitude]);

          const userMarker = new Feature({
            geometry: new Point(coords),
          });
          userMarker.setStyle(
            new Style({
              image: new Icon({
                src: "https://cdn-icons-png.flaticon.com/512/609/609803.png",
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
    const category =
      "0103,0402001,0402003,0402005,0402006,0402007,040100110,0203162";
    try {
      const response = await axios.get(
        `/api/req/search?key=${apiKey}&domain=http://localhost:3000&service=search&request=search&version=2.0&query=천문대&type=PLACE&category=${category}&format=json&size=1000`
      );

      const items = response.data.response.result.items;

      results.push(...items);
    } catch (error) {
      console.error("Error fetching observatories:", error);
    }

    const uniqueResults = results.reduce((acc, poi) => {
      if (!acc.find((item: { title: any }) => item.title === poi.title)) {
        acc.push(poi);
      }
      return acc;
    }, []);

    setPoiList(uniqueResults);
    displayObservatoriesOnMap(uniqueResults, map);
  };

  const displayObservatoriesOnMap = (observatories: any[], map: ol.Map) => {
    const features = observatories.map((obs: any) => {
      try {
        const coords = fromLonLat([
          parseFloat(obs.point.x),
          parseFloat(obs.point.y),
        ]);
        const feature = new Feature({
          geometry: new Point(coords),
          name: obs.title,
        });
        feature.setStyle(
          new Style({
            image: new Icon({
              src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
              scale: 0.03,
            }),
          })
        );
        return feature;
      } catch (error) {
        console.error("Error creating feature:", error);
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
    mapInstanceRef.current.getView().setZoom(15);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedList = sortedPoiList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(poiList.length / itemsPerPage);

  const getVisiblePages = (currentPage: number, totalPages: number) => {
    let maxVisible = 10; // 기본값
    if (window.innerWidth < 640) {
      // sm 브레이크포인트
      maxVisible = 5;
    } else if (window.innerWidth < 1024) {
      // lg 브레이크포인트
      maxVisible = 7;
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start + 1 < maxVisible) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 현재 위치로 이동하는 함수
  const moveToCurrentLocation = () => {
    if (userLocation && mapInstanceRef.current) {
      const coords = fromLonLat(userLocation);
      mapInstanceRef.current.getView().setCenter(coords);
      mapInstanceRef.current.getView().setZoom(12);
    }
  };

  // POI 목록 정렬
  useEffect(() => {
    if (userLocation && poiList && poiList.length > 0) {
      const sortedPOIs = [...poiList].sort((a, b) => {
        const distA = calculateDistance(
          userLocation[1],
          userLocation[0],
          parseFloat(a.point.y),
          parseFloat(a.point.x)
        );
        const distB = calculateDistance(
          userLocation[1],
          userLocation[0],
          parseFloat(b.point.y),
          parseFloat(b.point.x)
        );
        return distA - distB;
      });
      setSortedPoiList(sortedPOIs);
    }
  }, [userLocation, poiList]);

  return (
    <Layout title="천문대">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-[500px] rounded-lg shadow-lg mb-6"
          ></div>
          <button
            onClick={moveToCurrentLocation}
            className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            현재 위치
          </button>
        </div>

        {userLocation && (
          <p className="text-gray-600 mb-4">
            사용자의 위치: 위도 {userLocation[1]}, 경도 {userLocation[0]}
          </p>
        )}

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">천문대 목록</h3>
          <ul className="space-y-4">
            {paginatedList.map((poi, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <a
                    href={`https://search.naver.com/search.naver?query=${encodeURIComponent(
                      poi.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {poi.title}
                  </a>
                  <span className="text-gray-600 text-sm">
                    {poi.address.road
                      ? ` (${poi.address.road})`
                      : ` (${poi.address.parcel})`}
                  </span>
                </div>
                <button
                  onClick={() => handlePoiClick(poi)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  위치 보기
                </button>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              ≪
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              ＜
            </button>

            {getVisiblePages(currentPage, totalPages).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              ＞
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              ≫
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapComponent;
