import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-page";
import { getClassQuestionByQuizId } from "../data/queries";
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
import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const quizId = params.quizId;
  const questions = await getClassQuestionByQuizId(client, { quizId });
  return { questions };
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
  return (
    <div className="space-y-20 flex justify-center w-full">
      <div className="w-1/2 bg-amber-100 h-[800px] flex flex-col items-center justify-center gap-3">
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
        <Carousel className="w-7/8" setApi={setApi}>
          <CarouselContent>
            {loaderData.questions.map((question) => {
              const answerText = answers[question.question_id] || "";
              const minLength = question.question_min_length ?? 0;

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
                      <ToggleGroup
                        type="single"
                        value={confidenceLevels[question.question_id]}
                        onValueChange={(val) =>
                          setConfidenceLevels((prev) => ({
                            ...prev,
                            [question.question_id]: val || "unanswered",
                          }))
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
                      <div className="w-full">
                        {question.question_type === "multiple_choice" ? (
                          question.class_quiz_choices.map((choice) => (
                            <div
                              key={choice.choice_id}
                              className="flex flex-col mb-3"
                            >
                              <Button variant="outline">
                                {choice.choice_text}
                              </Button>
                            </div>
                          ))
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
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
