import React from "react";
import Layout from "../components/layout/Layout";
import { useGeolocation } from "../hooks/useGeolocation";

const ConstellationPage: React.FC = () => {
  const locationState = useGeolocation();

  const generateConstellation = () => {
    if (!locationState.location) {
      return;
    }
    // 위치 정보를 사용한 별자리 생성 API 호출 로직 구현
  };

  return (
    <Layout title="별무리 맺음">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            별무리 맺음
          </h2>

          {/* 위치 정보 */}
          <div className="mb-8">
            {locationState.isLoading ? (
              <div className="text-gray-600">위치 정보를 가져오는 중...</div>
            ) : locationState.location ? (
              <div className="text-sm text-gray-600">
                위도: {locationState.location.latitude.toFixed(6)}, 경도:{" "}
                {locationState.location.longitude.toFixed(6)}
              </div>
            ) : null}
            {locationState.error && (
              <div className="text-red-500 text-sm mt-2">
                {locationState.error}
              </div>
            )}
          </div>

          {/* 별자리 생성 */}
          <div className="space-y-6">
            <button
              onClick={generateConstellation}
              disabled={!locationState.location || locationState.isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-green-300"
            >
              별무리 맺어주기
            </button>

            <div className="aspect-square bg-gray-100 rounded-lg">
              {/* 생성된 별자리 이미지 표시 */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConstellationPage;
