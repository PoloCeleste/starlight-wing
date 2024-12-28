import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { api, authStore } from "../../api/apiClient";


interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!authStore.getAccessToken());
  }, []);

  if (!Array.isArray(posts)) {
    return <p>게시글이 없습니다.</p>;
  }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
            <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {post.image ? (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">빛그림 없음</span>
                    </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="mr-3">글쓴이: {post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {isLoggedIn ? (
                    <>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      <Link
                          to={`/board/${post.id}`}
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        글 더보기
                      </Link>
                    </>
                ) : (
                    <p className="text-gray-500 mb-4">
                      내용을 보려면 로그인이 필요합니다.
                    </p>
                )}
              </div>
            </div>
        ))}
      </div>
  );
};

export default PostList;
