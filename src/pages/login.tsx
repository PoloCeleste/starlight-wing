import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import {navigate} from "gatsby";
// import AuthService from "../services/AuthService";
import { api, authStore } from "../api/apiClient";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 전송 허용
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        authStore.setAccessToken(data.token); // 올바른 메서드 호출 방식
        console.log("로그인 성공:", data);

        // // 토큰 저장
        // const { token: accessToken, refreshToken } = data;
        // localStorage.setItem("accessToken", accessToken); // Access Token 저장
        // localStorage.setItem("refreshToken", refreshToken); // Refresh Token 저장

        alert("로그인에 성공했습니다!");

        // 메인 페이지로 이동
        navigate("/"); // 메인 페이지 경로로 이동
      } else {
        const errorData = await response.json();
        console.error("로그인 실패:", errorData.message);
        alert(`로그인 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생:", error);
      alert("로그인 요청 중 문제가 발생했습니다.");
    }
  };

  return (
      <Layout title="어울리기">
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
              로그인
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                  사용자 이름
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                />
              </div>
              <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                  암호
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      </Layout>
  );
};

export default LoginPage;