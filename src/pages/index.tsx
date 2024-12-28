import * as React from "react";
import Layout from "../components/layout/Layout";
import UserInfo from "../components/home/UserInfo";
import WeatherWidget from "../components/home/WeatherWidget";
import MiniCalendar from "../components/home/MiniCalendar";
import RecentPosts from "../components/home/RecentPosts";
import AuthService from "../services/AuthService";

const IndexPage: React.FC = () => {
  const isLoggedIn = !!AuthService.getInstance().getAccessToken(); // 로그인 상태 확인

  return (
    <Layout title="첫자리">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <UserInfo />
        <WeatherWidget />
        <MiniCalendar />
        <RecentPosts />
        {!isLoggedIn && (
          <div className="col-span-4 text-center text-gray-500">
            로그인 후 더 많은 기능을 사용할 수 있습니다.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
