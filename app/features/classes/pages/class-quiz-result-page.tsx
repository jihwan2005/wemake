import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-result-page";
import { getClassQuizResult } from "../data/queries";
import { getLoggedInUserId } from "~/features/users/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const quizId = params.quizId;
  const results = await getClassQuizResult(client, {
    quizId,
    userId,
  });
  return { results };
};

export default function ClassQuizResultPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <div className="grid grid-cols-5">
        {loaderData.results.map((result) => (
          <div className="flex flex-col gap-2">
            <div>
              <span>{result.question_position}. </span>
              <span>
                {result.is_correct_answer === true
                  ? "정답"
                  : result.is_correct_answer === false
                  ? "오답"
                  : "채점 중"}
              </span>{" "}
            </div>
            <div>
              {" "}
              <span>
                {result.question_type === "multiple_choice"
                  ? "내가 선택한 답"
                  : "내가 작성한 답"}
              </span>{" "}
              :{" "}
              <span>
                {result.question_type === "multiple_choice"
                  ? result.choice_text
                  : result.answer_text === null
                  ? "작성 안 함"
                  : result.answer_text}
              </span>
            </div>
            {result.question_type === "multiple_choice" && (
              <div>
                <span>정답 : {result.correct_choice_text}</span>
              </div>
            )}
            <div>
              <span>배점 : {result.question_point}</span>
            </div>
            {result.question_type !== "multiple_choice" && (
              <div>
                <span>획득 점수 : </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
