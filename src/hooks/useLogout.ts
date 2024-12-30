import { api, authStore } from "../api/apiClient";

const useLogout = () => {
  const handleLogout = async () => {
    try {
      const response = await api.post("/v1/user/logout");
      if (response.status === 200) {
        console.log("로그아웃 성공:", response.data.message);

        // 클라이언트 인증 상태 초기화
        authStore.clearAuth();
        window.location.href = "/"; // 홈 페이지로 리다이렉트
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return { handleLogout };
};

export default useLogout;