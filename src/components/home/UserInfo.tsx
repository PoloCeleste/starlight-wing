import React from "react";

const UserInfo: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {user ? (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            반갑습니다, {user.username}님!
          </h2>
          <p className="text-gray-600">{/* 추가로 표시할 정보 */}</p>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600">
            정보를 보시려면 로그인을 하셔야 합니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
