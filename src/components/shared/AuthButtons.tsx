import React from "react";
import { Link } from "gatsby";

interface AuthState {
  isLoggedIn: boolean;
  username?: string;
}

const AuthButtons: React.FC = () => {
  const [authState, setAuthState] = React.useState<AuthState>({
    isLoggedIn: false,
  });

  const handleLogout = () => {
    setAuthState({ isLoggedIn: false });
    // 로그아웃 처리
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
            그만하기
            {/* Logout */}
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            어울리기
            {/* Login */}
          </Link>
          <Link
            to="/register"
            className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            이름올리기
            {/* Register */}
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
