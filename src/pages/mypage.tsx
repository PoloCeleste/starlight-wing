import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { api } from "../api/apiClient.ts";

const MyPage: React.FC = () => {
  const [userProfile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setProfile(response.data); // 프로필 데이터 상태에 저장
      } catch (error) {
        console.error("프로필 불러오기 실패:", error);
        setError("프로필 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <Layout title="혜윰터">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          <div>로딩 중...</div>
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout title="혜윰터">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          <div>{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="혜윰터">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {!userProfile ? (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                사용자 정보
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-semibold">Username:</span>{" "}
                  {userProfile.username}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {userProfile.email}
                </p>
                <p>
                  <span className="font-semibold">Join Date:</span>{" "}
                  {userProfile.joinDate}
                </p>
                <p>
                  <span className="font-semibold">Total Posts:</span>{" "}
                  {userProfile.posts}
                </p>
              </div>

              {/* 수정 가능한 것들 제한 걸기, 정보 수정 페이지 만들어야 함 */}
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
                Edit Profile
              </button>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                My Activities
              </h2>
              {/* 활동 내역들. 뭐 댓글 같은거? */}
            </div>
          </>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-600">
            혜윰터에 들어서려면 로그인을 하세요.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPage;
