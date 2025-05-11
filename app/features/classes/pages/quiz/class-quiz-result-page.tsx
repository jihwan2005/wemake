import { makeSSRClient } from "~/supa-client";

import { getLoggedInUserId } from "~/features/users/queries";
import { Button } from "~/common/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import { Textarea } from "~/common/components/ui/textarea";
import { Form, useActionData } from "react-router";

import { useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import type { Route } from "./+types/class-quiz-result-page";
import { getClassQuizResult } from "~/features/classes/data/queries";
import { createClassQuizStudentDispute } from "~/features/classes/data/mutations";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const quizId = params.quizId;
  const results = await getClassQuizResult(client, {
    quizId,
    userId,
  });
  let totalScore = 0;

  for (const result of results) {
    if (result.question_type === "multiple_choice") {
      if (result.is_correct_answer === true) {
        totalScore += result.question_point ?? 0;
      }
    } else {
      if (result.final_score !== null) {
        totalScore += Number(result.final_score);
      }
    }
  }
  return { results, totalScore };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const answerId = formData.get("answerId") as string;
  const disputeText = formData.get("disputeText") as string;
  const hadDispute = formData.get("hadDispute") === "true";
  await createClassQuizStudentDispute(client, {
    userId,
    answerId,
    disputeText,
  });
  return {
    success: true,
    message: hadDispute ? "이의 신청 수정 완료!" : "이의 신청 제출 완료!",
  };
};

export default function ClassQuizResultPage({
  loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.message) {
      alert(actionData.message);
    }
  }, [actionData]);
  return (
    <div className="space-y-20">
      <h2 className="text-xl font-bold">
        현재 점수: {loaderData.totalScore}점
      </h2>
      <div className="grid grid-cols-5">
        {loaderData.results.map((result) => (
          <div className="flex flex-col gap-2">
            <div>
              <span>{result.question_position}. </span>
              <span className="mr-10">
                {result.is_correct_answer === true
                  ? "정답"
                  : result.is_correct_answer === false
                  ? "오답"
                  : result.final_score != null
                  ? "채점 완료"
                  : "채점 중"}
              </span>{" "}
              {result.question_type !== "multiple_choice" && (
                <Popover>
                  <PopoverTrigger>
                    <Button>이의 신청</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Form method="post">
                      <input
                        type="hidden"
                        name="answerId"
                        value={result.answer_id!}
                      />
                      <input
                        type="hidden"
                        name="hadDispute"
                        value={result.dispute_text ? "true" : "false"}
                      />
                      <Textarea
                        placeholder="이의 신청 내용 작성하기"
                        className="mb-5"
                        name="disputeText"
                        defaultValue={result.dispute_text ?? ""}
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <LoaderCircle className="animate-spin h-4 w-4" />
                          ) : result.dispute_text ? (
                            "수정"
                          ) : (
                            "제출"
                          )}
                        </Button>
                      </div>
                    </Form>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div>
              <span>문제 : {result.question_text}</span>
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
                <span>획득 점수 : {result.final_score}</span>
              </div>
            )}
            {result.score_reason && (
              <div>
                <span>
                  점수 부여 이유 :{" "}
                  {result.score_reason ? result.score_reason : "미기재"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
