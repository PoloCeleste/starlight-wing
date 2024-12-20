import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import DiaryModal from "../components/calendar/DiaryModal";

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem("diaryEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    setIsModalOpen(true);
  };

  const handleUpdate = (index: number, newContent: string) => {
    setDiaryEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index] = {
        ...newEntries[index],
        content: newContent,
      };
      return newEntries;
    });
  };

  const handleDelete = (id: number) => {
    setDiaryEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
  };

  // diraryEntries 내역 변경 감지하면 로컬스토리지 갱신. 백엔드 구현 끝나면 그때 그거에 맞게 수정.
  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  // 웹 페이지 로딩 시 화면 너비로 모바일인지 아닌지 체크
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Layout title="Calendar">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
          {/* 상단 영역 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              &lt;
            </button>
            <div className="flex items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              {/* 오늘 날짜 이동 버튼 */}
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Today
              </button>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              &gt;
            </button>
          </div>

          {/* 요일 영역 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 text-sm md:text-base"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 영역 */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(firstDay)].map((_, index) => (
              // 해당 월의 1일 앞 칸까지 빈 칸 생성
              <div
                key={`empty-${index}`}
                className={`aspect-[3/4] md:aspect-[4/3] p-2`}
              />
            ))}

            {/* 날짜 칸 생성 */}
            {[...Array(daysInMonth)].map((_, index) => {
              const year = currentDate.getFullYear();
              const month = String(currentDate.getMonth() + 1).padStart(2, "0");
              const day = String(index + 1).padStart(2, "0");
              const dateString = `${year}-${month}-${day}`;

              // 다이어리 작성 되었는지 확인하는 플래그 생성
              const hasEntry = diaryEntries.some((entry) => {
                if (!entry.selectedDate) return false;
                try {
                  const entryDate = new Date(entry.selectedDate);
                  return (
                    entryDate
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        timeZone: "Asia/Seoul",
                      })
                      .split(". ")
                      .join("-")
                      .replace(".", "") === dateString
                  );
                } catch (error) {
                  return false;
                }
              });

              // 해당 날짜의 다이어리 엔트리 수 계산
              const entryCount = diaryEntries.filter((entry) => {
                if (!entry.selectedDate) return false;
                try {
                  const entryDate = new Date(entry.selectedDate);
                  return (
                    entryDate
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        timeZone: "Asia/Seoul",
                      })
                      .split(". ")
                      .join("-")
                      .replace(".", "") === dateString
                  );
                } catch (error) {
                  return false;
                }
              }).length;

              // 색의 명도 계산 (0.3 ~ 1.0 사이의 값)
              const brightness =
                entryCount > 0 ? Math.min(0.3 + entryCount * 0.1, 1.0) : 0;

              return (
                <div
                  key={index + 1}
                  onClick={() => handleDateClick(index + 1)}
                  className={`
                    aspect-[3/4] md:aspect-[4/3] 
                    border hover:bg-blue-50 cursor-pointer p-2 
                    transition-colors relative
                    ${isToday(index + 1) ? "border-blue-500 border-2" : ""}
                  `} //오늘 날짜는 파랑 테두리 두르기
                  style={
                    isMobile && hasEntry
                      ? {
                          backgroundColor: `rgba(59, 130, 246, ${brightness})`,
                        }
                      : {}
                  } // 모바일이면 점으로 표현하지 않고 칸 전체 칠하기
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between">
                      <span
                        className={`
                        text-xs sm:text-sm md:text-base
                        ${isToday(index + 1) ? "font-bold" : "font-medium"}
                      `}
                        style={
                          isMobile && hasEntry && brightness === 1
                            ? {
                                color: "whitesmoke",
                              }
                            : {}
                        }
                      >
                        {index + 1}
                      </span>
                      {!isMobile && hasEntry && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${brightness})`,
                          }}
                        />
                      )}
                    </div>

                    {/* 날씨와 달 정보를 위한 공간 */}
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                      <span>{/* 날씨 아이콘 */}</span>
                      <span>{/* 달 모양 */}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isModalOpen && selectedDate && (
          <DiaryModal
            date={selectedDate}
            existingEntries={diaryEntries.filter((entry) => {
              const entryDate = new Date(entry.selectedDate);
              const entryDateString = entryDate.toISOString().split("T")[0];
              const selectedDateString = selectedDate
                .toISOString()
                .split("T")[0];
              return entryDateString === selectedDateString;
            })}
            onClose={() => setIsModalOpen(false)}
            onSave={(content) => {
              const now = new Date();
              const newEntry = {
                id: Date.now(),
                selectedDate: selectedDate.toISOString(),
                createdAt: now.toISOString(),
                content,
              };
              setDiaryEntries((prevEntries) => [...prevEntries, newEntry]);
              setIsModalOpen(false);
            }}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
};

export default CalendarPage;
