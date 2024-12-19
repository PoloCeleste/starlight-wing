import React, { useState, useEffect } from "react";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const DiaryModal: React.FC<DiaryModalProps> = ({
  date,
  existingEntries,
  onClose,
  onSave,
  onUpdate,
  onDelete,
}) => {
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content);
      setContent("");
    }
  };

  const handleEdit = (id: number, content: string) => {
    setEditId(id);
    setEditContent(content);
  };

  const handleUpdate = (id: number) => {
    if (editContent.trim()) {
      onUpdate(id, editContent);
      setEditId(null);
      setEditContent("");
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">
          {date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Seoul",
          })}
        </h3>
        <div className="mb-4 max-h-40 overflow-y-auto">
          {existingEntries?.map((entry) => (
            <div key={entry.id} className="mb-2">
              <div className="flex justify-between items-center mr-3">
                <div className="text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Seoul",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleEdit(entry.id, entry.content)}
                    className="text-blue-600 hover:text-blue-700 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
              {editId === entry.id ? (
                <div className="mt-2 mr-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setEditId(null)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleUpdate(entry.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      확인
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded">{entry.content}</div>
              )}
              <div className="border-b border-gray-200 my-2" />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-20 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="오늘의 일기를 작성해주세요..."
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiaryModal;
