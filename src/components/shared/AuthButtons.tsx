import React, { useEffect } from "react";
import { Link, navigate } from "gatsby";
import { api, authStore } from "../../api/apiClient";
// import useLogout from "../../hooks/useLogout";
interface AuthState {
  isLoggedIn: boolean;
  username?: string;
}

// 커스텀 훅에서 로그아웃 함수 가져오기
// const { handleLogout } = useLogout();

const AuthButtons: React.FC = () => {
  const [authState, setAuthState] = React.useState<AuthState>({
    isLoggedIn: false,
    username: "",
  });

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = authStore.getAccessToken();
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.userNm) {
            setAuthState({
              isLoggedIn: true,
              username: decodedToken.userNm,
            });
          }
          const expirationTime = decodedToken.exp * 1000;
          const currentTime = Date.now();
          if (expirationTime - currentTime < 60000) {
            // 1분
            const response = await api.post("/v1/user/refresh", null, {
              withCredentials: true,
            });
            console.log(response);
            if (response.data.accessToken) {
              authStore.setAccessToken(response.data.accessToken);
            }
          }
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          handleLogout();
        }
      }
    };

    fetchUserInfo();
    const interval = setInterval(fetchUserInfo, 60000); // 1분마다
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      await api.post("/v1/user/logout", null, {
        withCredentials: true,
      });

      // 쿠키 삭제
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 토큰 제거
      authStore.clearAuth();
      // 상태 업데이트
      setAuthState({ isLoggedIn: false, username: "" });

      // 홈으로 이동
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {authState.isLoggedIn ? (
        <>
          <span className="text-white hidden sm:inline">
            반갑습니다, {authState.username}님!
          </span>
          <button
            onClick={handleLogout}
            className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            로그인
          </Link>
          <Link
            to="/register"
            className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            회원가입
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
