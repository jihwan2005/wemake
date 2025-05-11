import { makeSSRClient } from "~/supa-client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/common/components/ui/carousel";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/common/components/ui/toggle-group";
import { Card, CardContent } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import { Form, redirect } from "react-router";

import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/class-quiz-page";
import {
  getClassQuestionByQuizId,
  getClassQuizLimitTime,
} from "~/features/classes/data/queries";
import {
  createClassQuizAnswers,
  createClassQuizResponse,
} from "~/features/classes/data/mutations";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const quizId = params.quizId;
  const questions = await getClassQuestionByQuizId(client, { quizId });
  const limitTime = await getClassQuizLimitTime(client, { quizId });
  return { questions, limitTime };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const quizId = params.quizId;
  const formData = await request.formData();
  const entries = Array.from(formData.entries());
  const answers: Record<string, string> = {};
  const confidence: Record<string, string> = {};

  for (const [key, value] of entries) {
    const answerMatch = key.match(/^answers\[(\d+)]$/);
    const confidenceMatch = key.match(/^confidence\[(\d+)]$/);

    if (answerMatch) {
      const id = answerMatch[1];
      answers[id] = value.toString();
    } else if (confidenceMatch) {
      const id = confidenceMatch[1];
      confidence[id] = value.toString();
    }
  }
  const response = await createClassQuizResponse(client, {
    quizId,
    userId,
  });

  await createClassQuizAnswers({
    client,
    responseId: response.response_id,
    answers,
    confidence,
  });
  return redirect(`/classes/${params.classId}/quiz`);
};

export default function ClassQuizPage({ loaderData }: Route.ComponentProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidenceLevels, setConfidenceLevels] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleConfidenceChange = (questionId: string, value: string) => {
    setConfidenceLevels((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  const timeLimit = loaderData.limitTime.time_limit_minutes! * 60; // 초 단위
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert(
        "제한 시간이 모두 소요되어 시험이 자동 제출됩니다. 수고하셨습니다!"
      );
      formRef.current?.submit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-20 flex flex-col items-center justify-center w-full">
      <div className="text-xl font-bold">남은 시간: {formatTime(timeLeft)}</div>

      <div className="w-1/2 bg-amber-100 h-[850px] flex flex-col items-center justify-center gap-3">
        <div className="flex gap-2 flex-wrap justify-center">
          {loaderData.questions.map((question, index) => {
            const level = confidenceLevels[question.question_id];
            let buttonColorClass = "border"; // 기본값

            if (level === "confident") {
              buttonColorClass = "bg-green-500 text-white";
            } else if (level === "unsure") {
              buttonColorClass = "bg-yellow-400 text-black";
            } else if (level === "unanswered") {
              buttonColorClass = "bg-red-500 text-white";
            } else {
              buttonColorClass =
                current === index + 1 ? "bg-blue-500 text-white" : "border";
            }

            return (
              <Button
                key={index}
                size="sm"
                onClick={() => api?.scrollTo(index)}
                className={`px-3 ${buttonColorClass}`}
                variant="outline"
              >
                {index + 1}
              </Button>
            );
          })}
        </div>

        {/* Form 컴포넌트에 method='post'만 남기고, onChange는 그대로 처리 */}
        <Form method="post" className="w-7/8" ref={formRef}>
          <Carousel setApi={setApi}>
            <CarouselContent>
              {loaderData.questions.map((question) => {
                const answerText = answers[question.question_id] || "";
                const minLength = question.question_min_length ?? 0;
                const confidence =
                  confidenceLevels[question.question_id] || "unanswered";

                return (
                  <CarouselItem key={question.question_id}>
                    <Card>
                      <CardContent className="w-full h-[650px] flex flex-col">
                        <div className="w-full flex justify-start gap-2 mb-5">
                          <span className="text-2xl">
                            {question.question_position}.
                          </span>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-2xl">
                              {question.question_text}
                            </span>
                            <Popover>
                              <PopoverTrigger>
                                <Lightbulb className="size-7 cursor-pointer" />
                              </PopoverTrigger>
                              <PopoverContent
                                side="left"
                                className="z-[9999] max-w-xs"
                                align="start"
                              >
                                {question.question_hint}
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Confidence에 대한 ToggleGroup 처리 */}
                        <ToggleGroup
                          type="single"
                          value={confidenceLevels[question.question_id]}
                          onValueChange={(val) =>
                            handleConfidenceChange(
                              question.question_id + "",
                              val || "unanswered"
                            )
                          }
                          className="mb-4"
                        >
                          <ToggleGroupItem value="confident">
                            ✅ 확신 있음
                          </ToggleGroupItem>
                          <ToggleGroupItem value="unsure">
                            🤔 애매함
                          </ToggleGroupItem>
                          <ToggleGroupItem value="unanswered">
                            ❌ 못 풀었음
                          </ToggleGroupItem>
                        </ToggleGroup>

                        {/* 질문에 따른 답변 옵션 처리 */}
                        <div className="w-full">
                          {question.question_type === "multiple_choice" ? (
                            question.class_quiz_choices.map((choice) => {
                              const isSelected =
                                answers[question.question_id] ===
                                choice.choice_id.toString();

                              return (
                                <div
                                  key={choice.choice_id}
                                  className="flex flex-col mb-3"
                                >
                                  <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() =>
                                      handleAnswerChange(
                                        question.question_id + "",
                                        choice.choice_id.toString()
                                      )
                                    }
                                    className={
                                      isSelected
                                        ? "border-2 border-green-500"
                                        : ""
                                    }
                                  >
                                    {choice.choice_text}
                                  </Button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex flex-col gap-2">
                              <div className="text-sm text-gray-500 text-right">
                                {answerText.length} / {minLength} 글자
                              </div>
                              <textarea
                                className="w-full h-40 p-2 border rounded-md"
                                placeholder={
                                  question.question_type === "short_answer"
                                    ? "답변을 입력하세요."
                                    : `최소 글자 수 : ${minLength}`
                                }
                                value={answerText}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    question.question_id + "",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
                        </div>

                        {/* 숨겨진 input들, 실제로 폼에 제출할 값 */}
                        <input
                          type="hidden"
                          name={`answers[${question.question_id}]`}
                          value={answerText}
                        />
                        <input
                          type="hidden"
                          name={`confidence[${question.question_id}]`}
                          value={confidence}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* 제출 버튼 */}
          <div className="mt-5 flex justify-end">
            <Button type="submit">제출하기</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
