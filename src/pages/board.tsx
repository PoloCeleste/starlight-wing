import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import PostList from "../components/board/PostList";
import SearchBar from "../components/board/SearchBar";
import { Link } from "gatsby";

const BoardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

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
              to="/create-post"
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
