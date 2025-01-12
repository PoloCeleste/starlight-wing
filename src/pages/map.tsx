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
    let currentPage = 1;

    while (true) {
      try {
        const response = await axios.get(
          `/api/req/search?key=${apiKey}&domain=http://localhost:3000&service=search&request=search&version=2.0&query=천문대&type=PLACE&format=json&page=${currentPage}`
        );

        const items = response.data.response.result.items;

        if (!items || items.length === 0) break;

        results.push(...items);

        const totalPages = response.data.response.page.total;
        if (currentPage >= totalPages) break;
        currentPage += 1;
      } catch (error) {
        console.error("Error fetching observatories:", error);
        break;
      }
    }

    const uniqueResults = results.reduce((acc, poi) => {
      if (!acc.find((item) => item.title === poi.title)) {
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

  const paginatedList = poiList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(poiList.length / itemsPerPage);

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
            {paginatedList.map((poi, index) => (
              <li key={index}>
                <a
                  href={`https://search.naver.com/search.naver?query=${encodeURIComponent(
                    poi.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    cursor: "pointer",
                  }}
                >
                  {poi.title}
                </a>
                {poi.address.road
                  ? ` (${poi.address.road})`
                  : ` (${poi.address.parcel})`}
                <button
                  onClick={() => handlePoiClick(poi)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  위치 보기
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: page === currentPage ? "#007bff" : "#f0f0f0",
                  color: page === currentPage ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapComponent;
