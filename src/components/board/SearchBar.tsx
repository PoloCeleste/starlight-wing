import React, { useState } from "react";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 로직 구현
  };

  return (
    <form onSubmit={handleSearch} className="my-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="글 찾기..."
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            placeholder-gray-400 transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 
            text-gray-400 hover:text-gray-600"
        >
          🔍
          {/* 다른 아이콘 넣어도 됨. 윈도우+ . 에서 아이콘 찾아 넣음. */}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
