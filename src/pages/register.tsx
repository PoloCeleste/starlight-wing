import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { navigate } from "gatsby";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");

  // 비밀번호 유효성 검사. 바꾸고 싶으면 수정하기
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (!/[A-Z]/.test(password)) {
      return "대문자를 포함해야 합니다.";
    }
    if (!/[a-z]/.test(password)) {
      return "소문자를 포함해야 합니다.";
    }
    if (!/[0-9]/.test(password)) {
      return "숫자를 포함해야 합니다.";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "특수문자(!@#$%^&*)를 포함해야 합니다.";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 비밀번호 실시간 검증
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }

    // 비밀번호 확인 실시간 검증
    if (name === "confirmPassword") {
      setConfirmError(
        value !== formData.password ? "비밀번호가 일치하지 않습니다." : ""
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직 구현
    // 성공 시 로그인 상태로 홈으로 이동
    navigate("/");
  };

  return (
    <Layout title="이름올리기">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            회원가입
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                사용자명
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                암호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  confirmError ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {confirmError && (
                <p className="mt-1 text-sm text-red-500">{confirmError}</p>
              )}
            </div>

            {/* 추가할 필드 있으면 추가하기 */}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 mt-6"
              disabled={!!passwordError || !!confirmError}
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
