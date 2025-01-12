import axios from "axios";
import { navigate } from "gatsby";

// AuthStore 간단한 싱글톤 구현
class AuthStore {
  private static instance: AuthStore;
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAuth(): void {
    this.accessToken = null;
  }
}

const authStore = AuthStore.getInstance();

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.GATSBY_API_URL || "http://3.36.30.27:8080/api",
  withCredentials: true, // 쿠키 전송 허용
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: 요청 전 Access Token 추가
api.interceptors.request.use((config) => {
  const token = authStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 에러 시 Access Token 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지
      try {
        // Refresh Token을 사용해 Access Token 갱신
        const response = await api.post("/v1/user/refresh", null, {
          withCredentials: true,
        });
        const newAccessToken = response.data.accessToken;

        // 갱신된 Access Token 저장
        authStore.setAccessToken(newAccessToken);

        // 이전 요청에 새 토큰 추가 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

        // 인증 상태 초기화 및 로그인 페이지로 이동
        authStore.clearAuth();
        navigate("/login");
        return Promise.reject(refreshError);
      }
    }

    // 다른 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export { api, authStore };
