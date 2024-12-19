import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout/Layout";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout title="404: Not Found">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-4xl font-bold mb-4">404: Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
