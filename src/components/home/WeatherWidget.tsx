import React from "react";

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = React.useState<WeatherData | null>(null);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("기상청API_URL");
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Weather fetch failed:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {weather ? (
        <>
          <h3 className="text-xl font-bold text-gray-800 mb-4">지금 날씨는</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">온도</span>
              <span className="font-semibold text-gray-800">
                {weather.temperature}°C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">상태</span>
              <span className="font-semibold text-gray-800">
                {weather.condition}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">위치</span>
              <span className="font-semibold text-gray-800">
                {weather.location}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-4">
          <p className="text-gray-500">하늘을 살피는 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
