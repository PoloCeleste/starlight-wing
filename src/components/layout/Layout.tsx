import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SEO from "../shared/SEO";
import useAuthRefresh from "../../hooks/useAuth"; // useAuthRefresh 추가

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  useAuthRefresh(); // 새로고침 시 인증 상태를 확인

  return (
    <div className="flex flex-col min-h-screen">
      <SEO title={title} />
      <Navbar />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-6 md:py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
