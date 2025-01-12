import React, { useEffect, useState } from "react";
import { api, authStore } from "../api/apiClient";
import { navigate } from "gatsby";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // 인증 상태 확인 중 여부

  useEffect(() => {
    const checkAuth = async () => {
      const token = authStore.getAccessToken();

      if (token) {
        // 토큰이 있으면 로그인 상태 유지
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken.exp * 1000 < Date.now()) {
          const response = await api.post("/v1/user/refresh", null, {
            withCredentials: true,
          });
          authStore.setAccessToken(response.data.accessToken);
        }
        setIsLoggedIn(true);
      } else {
        try {
          // 리프레시 토큰을 사용해 새 액세스 토큰 갱신
          const response = await api.post(
            "/v1/user/refresh",
            {},
            { withCredentials: true }
          );
          // 새 토큰 저장 후 로그인 상태 업데이트
          if (response.data.accessToken) {
            authStore.setAccessToken(response.data.accessToken);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("토큰 갱신 실패:", error);
          // 로그인 실패 시 상태 초기화 및 리다이렉트
          authStore.clearAuth();
          setIsLoggedIn(false);
          navigate("/login");
        } finally {
          setIsCheckingAuth(false); // 인증 확인 완료
        }
      }
    };

    checkAuth();
  }, []);

  return { isLoggedIn, isCheckingAuth };
};

export default useAuth;
