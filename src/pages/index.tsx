import * as React from "react";
import Layout from "../components/layout/Layout";
import UserInfo from "../components/home/UserInfo";
import WeatherWidget from "../components/home/WeatherWidget";
import MiniCalendar from "../components/home/MiniCalendar";
import RecentPosts from "../components/home/RecentPosts";

const IndexPage: React.FC = () => {
  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <UserInfo />
        <WeatherWidget />
        <MiniCalendar />
        <RecentPosts />
      </div>
    </Layout>
  );
};

export default IndexPage;
