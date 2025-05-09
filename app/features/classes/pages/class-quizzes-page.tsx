import { Hero } from "~/common/components/hero";
import { getClassById, getClassQuizzesByClassId } from "../data/queries";
import type { Route } from "./+types/class-quizzes-page";
import { browserClient, makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { createClassQuiz } from "../data/mutations";
import "react-datepicker/dist/react-datepicker.css";
import { ClassQuizzesBoard } from "./components/quiz/ClassQuizzesBoard";
import { ClassQuizStudentContent } from "./components/quiz/ClassQuizStudentContent";
import { ClassQuizTeacherContent } from "./components/quiz/ClassQuizTeacherContent";

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

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const limitTime = formData.get("limitTime") as string;
  await createClassQuiz(client, {
    userId,
    classId,
    title,
    description,
    startDate,
    endDate,
    limitTime,
  });
};

export default function ClassQuizzesPage({ loaderData }: Route.ComponentProps) {
  const [quiz, setQuiz] = useState<any | null>(null);
  const now = DateTime.now();
  const startTime = quiz ? DateTime.fromISO(quiz.start_time!) : null;
  const endTime = quiz ? DateTime.fromISO(quiz.end_time!) : null;
  const isBeforeStart = startTime ? now < startTime : false;
  const isEnded = endTime ? now >= endTime : false;
  const isOngoing = !isBeforeStart && !isEnded;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  useEffect(() => {
    const checkSubmission = async () => {
      if (!quiz) return;

      const { data } = await browserClient
        .from("class_quiz_responses")
        .select("*")
        .eq("quiz_id", quiz.quiz_id)
        .eq("profile_id", loaderData.userId)
        .maybeSingle();

      setHasSubmitted(!!data);
    };

    checkSubmission();
  }, [quiz]);
  return (
    <div className="space-y-20">
      <Hero title="Quiz" subtitle={`${loaderData.title}`} />
      <ClassQuizzesBoard
        quizzes={loaderData.quizzes}
        onQuizClick={setQuiz}
        userId={loaderData.userId}
        isAuthor={loaderData.author_id === loaderData.userId}
      />

      {quiz && (
        <Dialog open={true} onOpenChange={() => setQuiz(null)}>
          {loaderData.userId !== quiz.profile_id ? (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isBeforeStart ? "퀴즈 시작 전입니다" : isEnded ? "" : ""}
                </DialogTitle>
              </DialogHeader>
              <ClassQuizStudentContent
                quiz={quiz}
                startTime={startTime}
                endTime={endTime}
                isBeforeStart={isBeforeStart}
                isEnded={isEnded}
                isOngoing={isOngoing}
                onClose={() => setQuiz(null)}
                classId={loaderData.classId}
                hasSubmitted={hasSubmitted}
              />
            </DialogContent>
          ) : (
            <DialogContent>
              <ClassQuizTeacherContent
                quiz={quiz}
                setQuiz={setQuiz}
                isBeforeStart={isBeforeStart}
                isEnded={isEnded}
                classId={loaderData.classId}
              />
            </DialogContent>
          )}
        </Dialog>
      )}
    </div>
  );
}

