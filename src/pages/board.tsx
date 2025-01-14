import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import PostList from "../components/board/PostList";
import SearchBar from "../components/board/SearchBar";
import { Link } from "gatsby";
import { api, authStore } from "../api/apiClient";
import useAuthRefresh from "../hooks/useAuth"; // Custom Hook 사용

const BoardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState<string | null>(null); // 사용자 이름 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인 및 게시글 목록 가져오기
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = authStore.getAccessToken();
      setIsLoggedIn(!!token); // 로그인 여부 확인
      if (token) {
        try {
          // 사용자 정보 가져오기
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUsername(decodedToken.userNm || "익명");
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
        }
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts"); // 백엔드에서 게시글 목록 가져오기

        setPosts(response.data.content || []); // 게시글 목록 설정
      } catch (error) {
        console.error("게시글 목록 불러오기 실패:", error);
      }
    };

    checkLoginStatus();
    fetchPosts();
  }, []);

  return (
    <Layout title="별무리 모꼬지">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            별무리 모꼬지
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex-grow sm:flex-grow-0">
              <SearchBar />
            </div>
            <Link
              to={isLoggedIn ? "/create-post" : "/login"}
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200 text-center"
            >
              글올림
            </Link>
          </div>
        </div>
        <PostList posts={posts} />
      </div>
    </Layout>
  );
};

export default BoardPage;
