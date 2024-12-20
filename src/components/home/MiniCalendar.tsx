import React, { useState, useEffect } from "react";
import { Link } from "gatsby";

interface MoonPhase {
  phase: string;
  illumination: number;
}

interface CelestialEvent {
  title: string;
  date: string;
  description: string;
}

const MiniCalendar: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [todayEntries, setTodayEntries] = useState<DiaryEntry[]>([]);
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null);
  const [celestialEvents, setCelestialEvents] = useState<CelestialEvent[]>([]);

  useEffect(() => {
    // 오늘 작성된 일기 가져오기. 이건 나중에 백엔드 구현 끝나면 그거에 맞게 수정 예정.
    const entries = localStorage.getItem("diaryEntries");
    if (entries) {
      const parsedEntries: DiaryEntry[] = JSON.parse(entries);
      const today = new Date().toISOString().split("T")[0];
      const todaysDiaries = parsedEntries.filter(
        (entry) =>
          new Date(entry.selectedDate).toISOString().split("T")[0] === today
      );
      setTodayEntries(todaysDiaries);
    }

    // 월령 정보와 천체 이벤트는 API 호출로 구현 예정
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Event</h3>

      {/* 날짜 표시 */}
      <p className="text-gray-600 mb-4">
        {currentDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* 월령 정보 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h4 className="font-semibold text-gray-700 mb-2">Moon Phase</h4>
        {moonPhase ? (
          <div className="text-sm text-gray-600">
            <p>Phase: {moonPhase.phase}</p>
            <p>Illumination: {moonPhase.illumination}%</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Loading moon data...</p>
        )}
      </div>

      {/* 천체 이벤트 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h4 className="font-semibold text-gray-700 mb-2">Celestial Events</h4>
        {celestialEvents.length > 0 ? (
          <ul className="text-sm text-gray-600 space-y-2">
            {celestialEvents.map((event, index) => (
              <li key={index}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No events today</p>
        )}
      </div>

      {/* 오늘의 일기 */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Today's Diary</h4>
        {todayEntries.length > 0 ? (
          <div className="max-h-32 overflow-y-auto space-y-2">
            {todayEntries.map((entry) => (
              <div
                key={entry.id}
                className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
              >
                {entry.content}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No entries today</p>
        )}
      </div>

      <Link
        to="/calendar"
        className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
      >
        View Full Calendar
      </Link>
    </div>
  );
};

export default MiniCalendar;
