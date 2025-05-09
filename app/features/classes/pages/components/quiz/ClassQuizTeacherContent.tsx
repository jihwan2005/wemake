import { Button } from "~/common/components/ui/button";
import { Switch } from "~/common/components/ui/switch";
import { Link } from "react-router";
import { useFetcher } from "react-router";

interface ClassQuizTeacherContentProps {
  quiz: any;
  setQuiz: React.Dispatch<React.SetStateAction<any | null>>; // setQuiz를 추가
  isBeforeStart: boolean;
  isEnded: boolean;
  classId: string;
}

export const ClassQuizTeacherContent = ({
  quiz,
  setQuiz,
  isBeforeStart,
  isEnded,
  classId,
}: ClassQuizTeacherContentProps) => {
  const fetcher = useFetcher();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between w-full border rounded-md p-3 mt-5">
        <span>공개 전환</span>
        <Switch
          checked={quiz.is_public}
          onCheckedChange={(checked) => {
            setQuiz((prev: any) => ({
              ...prev,
              is_public: checked,
            })); // setQuiz를 여기서 사용
            fetcher.submit(
              { quizId: quiz.quiz_id },
              {
                method: "post",
                action: `/classes/${classId}/quiz/public`, // 공개 전환 요청
              }
            );
          }}
        />
      </div>
      {isBeforeStart && quiz.is_public === false && (
        <Link to={`/classes/${classId}/quiz/${quiz.quiz_id}/upload`}>
          <Button>문제 출제 및 수정</Button>
        </Link>
      )}
      {isEnded && <Button>삭제하기</Button>}
      {!isBeforeStart && !isEnded && (
        <Link to={`/classes/${classId}/quiz/${quiz.quiz_id}/score `}>
          <Button>채점하기</Button>
        </Link>
      )}
    </div>
  );
};
