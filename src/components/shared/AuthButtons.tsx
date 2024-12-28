import React, { useEffect } from "react";
import { Link, navigate } from "gatsby";
import { api, authStore } from "../../api/apiClient";

interface AuthState {
  isLoggedIn: boolean;
  username?: string;
}

const AuthButtons: React.FC = () => {
  const [authState, setAuthState] = React.useState<AuthState>({
    isLoggedIn: false,
    username: "",
  });

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const token = authStore.getAccessToken();
    if (token) {
      setAuthState({
        isLoggedIn: true,
        username: "사용자 이름", // 실제 API 호출로 대체 가능
      });
    }
  }, []);

  const handleLogout = () => {
    authStore.clearAuth(); // Access Token 제거
    setAuthState({ isLoggedIn: false });
    navigate("/"); // 메인 페이지로 리다이렉트
    console.log("로그아웃 완료");
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
