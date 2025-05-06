import { useState } from "react";
import { DateTime } from "luxon";
import { cn } from "~/lib/utils";
import { ClassQuizInfo } from "./ClassQuizInfo";

type Quiz = {
  quiz_id: number;
  quiz_title: string;
  quiz_description?: string;
  start_time: string;
  end_time: string;
  created_at: string | null;
  is_public: boolean;
  profile_id: string;
};

interface ClassQuizzesBoardProps {
  quizzes: Quiz[];
  userId: string;
  onQuizClick: (quiz: Quiz) => void;
  isAuthor: boolean;
}

export function ClassQuizzesBoard({
  quizzes,
  userId,
  onQuizClick,
  isAuthor,
}: ClassQuizzesBoardProps) {
  const now = DateTime.now();
  const [selectedTab, setSelectedTab] = useState<
    "all" | "upcoming" | "ongoing" | "ended"
  >("all");
  const visibleQuizzes = quizzes.filter((quiz) => {
    // 작성자는 자신의 모든 퀴즈를 볼 수 있음
    if (quiz.profile_id === userId) return true;

    // 작성자가 아닌 경우, 공개 퀴즈만 볼 수 있음
    return quiz.is_public;
  });

  const filteredQuizzes = visibleQuizzes.filter((quiz) => {
    if (selectedTab === "all") return true;
    const start = DateTime.fromISO(quiz.start_time);
    const end = DateTime.fromISO(quiz.end_time);

    if (selectedTab === "upcoming") return now < start;
    if (selectedTab === "ended") return now >= end;
    if (selectedTab === "ongoing") return now >= start && now < end;
    return false;
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  return (
    <div className="flex flex-col items-center">
      <div className="w-1/3 bg-white border-2 p-4 rounded-2xl">
        <div className="flex gap-4 mb-4">
          {(["all", "ongoing", "upcoming", "ended"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={cn(
                "px-4 py-2 rounded-md border text-sm",
                selectedTab === tab
                  ? "bg-black text-white"
                  : "bg-white text-gray-600 border-gray-300"
              )}
            >
              {tab === "all"
                ? "전체"
                : tab === "ongoing"
                ? "진행 중"
                : tab === "upcoming"
                ? "시작 전"
                : "종료됨"}
            </button>
          ))}
          {isAuthor && (
            <ClassQuizInfo
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          {filteredQuizzes.length === 0 ? (
            <div className="text-center text-gray-400">퀴즈가 없습니다.</div>
          ) : (
            filteredQuizzes.map((quiz) => {
              const startTime = DateTime.fromISO(quiz.start_time);
              const endTime = DateTime.fromISO(quiz.end_time);
              // 사용자가 작성한 퀴즈가 아니라면, 시간에 따른 비활성 스타일 적용
              const isInactive =
                quiz.profile_id !== userId &&
                (now < startTime || now >= endTime);

              return (
                <div
                  key={quiz.quiz_id}
                  className={cn(
                    "flex justify-between items-center p-3 rounded-lg border transition cursor-pointer",
                    isInactive && "bg-gray-100 text-gray-400",
                    !isInactive && "hover:bg-gray-50"
                  )}
                  onClick={() => onQuizClick(quiz)}
                >
                  <span>{quiz.quiz_title}</span>
                  <span className="text-sm">
                    {quiz.created_at
                      ? DateTime.fromISO(quiz.created_at).toISODate()
                      : ""}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
