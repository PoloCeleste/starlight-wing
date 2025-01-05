import React, { useState, useEffect } from "react";
import { Link } from "gatsby";

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
      const today = new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Seoul",
        })
        .replace(/\./g, "")
        .replace(/\s/g, "-");

      const todaysDiaries = parsedEntries.filter((entry) => {
        const entryDate = new Date(entry.selectedDate)
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "Asia/Seoul",
          })
          .replace(/\./g, "")
          .replace(/\s/g, "-");

        return entryDate === today;
      });
      setTodayEntries(todaysDiaries);
    }

    const today = new Date();
    const koreanDate = new Date(
      today.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );

    const year = koreanDate.getFullYear();
    const month = String(koreanDate.getMonth() + 1).padStart(2, "0");
    const day = String(koreanDate.getDate()).padStart(2, "0");

    const SKY_API_KEY = process.env.GATSBY_SKY_API_KEY;

    // 월령 정보 가져오기
    const fetchMoonPhase = async () => {
      try {
        const response = await fetch(
          `https://apis.data.go.kr/B090041/openapi/service/LunPhInfoService/getLunPhInfo?serviceKey=${SKY_API_KEY}&solYear=${year}&solMonth=${month}&solDay=${day}`
        );

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const lunAge = parseFloat(
          xmlDoc.querySelector("lunAge")?.textContent || "200"
        );
        ("images/500_moon01.png");
        if (lunAge != 200) {
          // 계산
          const phase = String(Math.floor(lunAge) + 1).padStart(2, "0");
          const calculateIllumination = (lunAge: number): number => {
            if (lunAge <= 15) {
              return Math.round((lunAge / 15) * 100);
            } else {
              return Math.round(((30 - lunAge) / 15) * 100);
            }
          };
          const illumination = calculateIllumination(lunAge);

          setMoonPhase({
            phase,
            illumination,
            imageUrl: `/images/500_moon${phase}.png`,
          });
        }
      } catch (error) {
        console.error("Failed to fetch moon phase:", error);
      }
    };

    fetchMoonPhase();

    // 천체 이벤트 가져오기
    const fetchCelestialEvents = async () => {
      try {
        const response = await fetch(
          `https://apis.data.go.kr/B090041/openapi/service/AstroEventInfoService/getAstroEventInfo?serviceKey=${SKY_API_KEY}&solYear=${year}&solMonth=${month}&numOfRows=100`
        );

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // 에러 체크
        const errorMsg = xmlDoc.querySelector("errMsg")?.textContent;
        if (errorMsg) {
          console.error("API Error(event):", errorMsg);
          return;
        }

        const items = xmlDoc.querySelectorAll("item");
        const todayEvents: CelestialEvent[] = [];

        items.forEach((item) => {
          const locdate = item.querySelector("locdate")?.textContent?.trim();
          const eventDate = `${year}${month}${day}`;

          if (locdate === eventDate) {
            const time = item.querySelector("astroTime")?.textContent || "";
            const event = item.querySelector("astroEvent")?.textContent || "";
            const seq = parseInt(item.querySelector("seq")?.textContent || "1");

            todayEvents.push({
              title: `${time ? `${time} - ` : ""}${event}`,
              date: eventDate,
              description: event,
              seq: seq,
            });
          }
        });

        // seq 순으로 정렬
        todayEvents.sort((a, b) => (a.seq || 0) - (b.seq || 0));
        setCelestialEvents(todayEvents);
      } catch (error) {
        console.error("Failed to fetch celestial events:", error);
      }
    };

    fetchCelestialEvents();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">오늘의 한마당</h3>

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
        <h4 className="font-semibold text-gray-700 mb-2">달나들이</h4>
        {moonPhase ? (
          <div className="text-sm text-gray-600">
            <img
              src={moonPhase.imageUrl}
              alt={`Moon phase ${moonPhase.phase}`}
              className="w-32 h-32 mx-auto mb-2"
            />
            <p>단계: {moonPhase.phase}/30</p>
            <p>빛비춤: {moonPhase.illumination}%</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">달빛 살피는 중입니다...</p>
        )}
      </div>

      {/* 천체 이벤트 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h4 className="font-semibold text-gray-700 mb-2">별하늘 구경거리</h4>
        {celestialEvents.length > 0 ? (
          <ul className="text-sm text-gray-600 space-y-2">
            {celestialEvents.map((event, index) => (
              <li key={index}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            오늘은 별빛 잔치가 없습니다...
          </p>
        )}
      </div>

      {/* 오늘의 일기 */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">오늘의 하루글</h4>
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
          <p className="text-sm text-gray-500">오늘은 하루글이 없네요...</p>
        )}
      </div>

      <Link
        to="/calendar"
        className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
      >
        온 달가름 보기
      </Link>
    </div>
  );
};

export default MiniCalendar;
