// components/quiz/ClassQuizStudentContent.tsx

import { Button } from "~/common/components/ui/button";
import { DateTime } from "luxon";
import { Link } from "react-router";

interface Props {
  quiz: any;
  startTime: DateTime | null;
  endTime: DateTime | null;
  isBeforeStart: boolean;
  isEnded: boolean;
  isOngoing: boolean;
  onClose: () => void;
  classId: string;
  hasSubmitted: boolean;
}

export const ClassQuizStudentContent = ({
  quiz,
  startTime,
  endTime,
  isBeforeStart,
  isEnded,
  isOngoing,
  onClose,
  classId,
  hasSubmitted,
}: Props) => {
  return (
    <div className="space-y-2">
      {isBeforeStart && (
        <>
          <p className="text-gray-700 whitespace-pre-wrap">
            {quiz.quiz_description}
          </p>
          <p className="text-sm text-gray-500">
            응시 가능 시간:{" "}
            <strong>{startTime?.toFormat("yyyy-MM-dd HH:mm")}</strong>
          </p>
          <div className="flex justify-end">
            <Button onClick={onClose}>확인</Button>
          </div>
        </>
      )}

      {isEnded && (
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600 font-semibold">
            이 퀴즈는 이미 종료되었습니다.
          </p>
          <span>종료일 : {endTime?.toFormat("yyyy-MM-dd HH:mm")}</span>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>확인</Button>
          </div>
        </div>
      )}

      {isOngoing && hasSubmitted && (
        <div className="text-center space-y-4">
          <p className="text-lg text-blue-600 font-semibold">
            이미 응시한 시험입니다.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Link to={`/classes/${classId}/quiz/${quiz.quiz_id}/result`}>
              <Button>결과 확인하기</Button>
            </Link>
          </div>
        </div>
      )}

      {isOngoing && !hasSubmitted && (
        <div className="text-center space-y-4">
          <p className="text-lg text-green-600 font-semibold">
            지금 퀴즈를 응시할 수 있습니다.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onClose}>
              나중에
            </Button>
            <Link to={`/classes/${classId}/quiz/${quiz.quiz_id}`}>
              <Button
                onClick={() => {
                  console.log("퀴즈 응시 시작");
                }}
              >
                응시하기
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
