import React from "react";
import { Link } from "gatsby";

const RecentPosts: React.FC = () => {
  const [recentPosts, setRecentPosts] = React.useState<Post[]>([]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">근래 글</h3>
      {recentPosts.length > 0 ? (
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li
              key={post.id}
              className="border-b border-gray-100 pb-2 last:border-b-0"
            >
              <Link
                to={`/board/${post.id}`}
                className="block hover:text-blue-600 transition-colors duration-200"
              >
                <div className="text-gray-800 mb-1 line-clamp-1">
                  {post.title}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">
          새로 지은 글은 없네요...
        </p>
      )}
    </div>
  );
};

export default RecentPosts;
