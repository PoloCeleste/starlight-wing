import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { navigate } from "gatsby";

const CreatePostPage: React.FC = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: null as File | null,
    imagePreview: "",
  });

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // 파일 입력 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!validTypes.includes(file.type)) {
        alert("JPG, PNG, GIF 파일만 업로드 가능합니다.");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기는 10MB 이하여야 합니다.");
        e.target.value = "";
        return;
      }
      setPostData({
        ...postData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API POST 호출
    navigate("/board");
  };

  return (
    <Layout title="글올림">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">글올림</h2>

        {/* 게시글 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 작성 */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              글머리
            </label>
            <input
              type="text"
              id="title"
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 이미지 넣기 (선택) */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              빛그림
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {postData.imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={postData.imagePreview}
                      alt="Preview"
                      className="mx-auto h-48 w-auto object-cover rounded"
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>자료 올리기</span>
                    <input
                      type="file"
                      id="file-upload"
                      name="file-upload"
                      accept="image/jpeg, image/png, image/gif"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* 본문 작성 */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              글몸
            </label>
            <textarea
              id="content"
              value={postData.content}
              onChange={(e) =>
                setPostData({ ...postData, content: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
              required
            />
          </div>

          {/* 작성 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              올리기
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePostPage;
