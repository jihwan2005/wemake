import { Hero } from "~/common/components/hero";
import { getClassById, getClassQuizzesByClassId } from "../data/queries";
import type { Route } from "./+types/class-quizzes-page";
import { makeSSRClient } from "~/supa-client";
import { Upload } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { getLoggedInUserId } from "~/features/users/queries";
import { DateTime } from "luxon";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const { title, author_id } = await getClassById(client, {
    classId: params.classId,
  });
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const quizzes = await getClassQuizzesByClassId(client, { classId });
  return { title, author_id, classId, userId, quizzes };
};

export default function ClassQuizzesPage({ loaderData }: Route.ComponentProps) {
  const [blockedQuiz, setBlockedQuiz] = useState<any | null>(null);

  return (
    <div className="space-y-20">
      <Hero title="Quiz" subtitle={`${loaderData.title}`} />

      {loaderData.author_id === loaderData.userId && (
        <Link to={`/classes/${loaderData.classId}/quiz/upload`}>
          <Button>
            <Upload className="size-4" />
          </Button>
        </Link>
      )}

      <div className="flex justify-center">
        <div className="w-1/3 bg-white border-2 p-2 rounded-2xl space-y-2">
          {loaderData.quizzes.map((quiz) => {
            const startTime = DateTime.fromISO(quiz.start_time!);
            const now = DateTime.now();
            const isStarted = now >= startTime;

            return (
              <div
                key={quiz.quiz_id}
                onClick={() => {
                  if (isStarted) {
                    window.location.href = `/classes/${loaderData.classId}/quiz/${quiz.quiz_id}`;
                  } else {
                    setBlockedQuiz(quiz); // 시작 전이면 모달 띄움
                  }
                }}
                className={`flex justify-between p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer ${
                  !isStarted ? "opacity-50" : ""
                }`}
              >
                <span>{quiz.quiz_title}</span>
                <span className="text-sm text-gray-500">
                  {DateTime.fromISO(quiz.created_at!).toISODate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 시작 전 모달 */}
      {blockedQuiz && (
        <Dialog open={true} onOpenChange={() => setBlockedQuiz(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>퀴즈 시작 전입니다</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-gray-700 whitespace-pre-wrap">
                {blockedQuiz.quiz_description}
              </p>
              <p className="text-sm text-gray-500">
                응시 가능 시간:{" "}
                <strong>
                  {DateTime.fromISO(blockedQuiz.start_time!).toFormat(
                    "yyyy-MM-dd HH:mm"
                  )}
                </strong>
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setBlockedQuiz(null)}>확인</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
