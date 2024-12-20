import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [locationState, setLocationState] = useState<LocationContextType>({
    location: null,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationState({
        location: null,
        isLoading: false,
        error: "위치 정보가 지원되지 않는 브라우저입니다.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          isLoading: false,
          error: "",
        });
      },
      (error) => {
        setLocationState({
          location: null,
          isLoading: false,
          error: "위치 정보를 가져오는데 실패했습니다.",
        });
      }
    );
  }, []);

  return locationState;
};
