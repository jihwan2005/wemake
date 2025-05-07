import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/common/components/ui/carousel";
import { Card, CardContent } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Plus } from "lucide-react";
import { Textarea } from "~/common/components/ui/textarea";
import { Input } from "~/common/components/ui/input";
import { Form } from "react-router";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-upload-page";
import { createQuizQuestion } from "../data/mutations";

type QuizItem = {
  question: string;
  questionType: "multiple_choice" | "short_answer" | "long_answer";
  questionPoint: number;
  options: Choice[];
  question_position: number;
};

type Choice = {
  choice_text: string;
  is_correct: boolean;
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const quizId = params.quizId!;
  const text = formData.get("questionText") as string;
  const point = formData.get("questionPoint") as string;
  const type = formData.get("questionType") as
    | "multiple_choice"
    | "short_answer"
    | "long_answer";
  const position = formData.get("questionPosition") as string;

  const choices: {
    choice_text: string;
    position: number;
    is_correct: boolean;
  }[] = [];

  const choiceTextMap: Record<number, string> = {};
  const isCorrectMap: Record<number, boolean> = {};

  formData.forEach((value, key) => {
    const match = key.match(
      /^questionChoices\[(\d+)\]\.(choice_text|is_correct)$/
    );
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];
      if (field === "choice_text") {
        choiceTextMap[index] = value as string;
      } else if (field === "is_correct") {
        isCorrectMap[index] = true;
      }
    }
  });

  Object.keys(choiceTextMap).forEach((key) => {
    const index = Number(key);
    choices.push({
      choice_text: choiceTextMap[index],
      position: index,
      is_correct: !!isCorrectMap[index],
    });
  });

  await createQuizQuestion(client, {
    quizId,
    text,
    point,
    type,
    position,
    choices,
  });
};

export default function ClassQuizUploadPage() {
  const [items, setItems] = useState<QuizItem[]>([
    {
      question: "",
      questionType: "multiple_choice",
      questionPoint: 1,
      options: [{ choice_text: "", is_correct: false }],
      question_position: 0,
    },
  ]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleAddItem = () => {
    const newItem: QuizItem = {
      question: "",
      questionType: "multiple_choice",
      questionPoint: 1,
      options: [{ choice_text: "", is_correct: false }],
      question_position: items.length,
    };
    setItems((prev) => [...prev, newItem]);

    setTimeout(() => {
      if (api) {
        setCount(api.scrollSnapList().length);
        api.scrollTo(items.length);
        setCurrent(items.length + 1);
      }
    }, 0);
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="space-y-20 flex justify-center w-full">
      <div className="w-1/2 bg-amber-100 h-[800px] flex flex-col items-center justify-center gap-4 rounded-md overflow-y-auto max-h-screen">
        <Button className="rounded-full" onClick={handleAddItem} type="button">
          <Plus className="size-6" />
        </Button>

        <Carousel className="w-7/8" setApi={setApi}>
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <Form method="post" className="w-full">
                  <input type="hidden" name="questionPosition" value={index} />
                  <Card>
                    <CardContent className="relative w-full h-[650px] flex justify-center text-xl">
                      <div className="absolute top-0 right-7 text-md text-white bg-black px-4 py-1 rounded-full">
                        {current}/{count}
                      </div>

                      <div className="flex flex-col w-full gap-1">
                        <Button
                          type="submit"
                          className="mt-4 w-fit self-center"
                        >
                          퀴즈 저장
                        </Button>

                        <div className="flex items-center gap-2">
                          <div className="mt-10 flex flex-col gap-3">
                            <span className="font-semibold">문제 유형</span>
                            <select
                              className="p-2 border rounded h-10"
                              name="questionType"
                              value={item.questionType}
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].questionType = e.target
                                  .value as QuizItem["questionType"];
                                if (e.target.value !== "multiple_choice") {
                                  newItems[index].options = [];
                                } else if (
                                  newItems[index].options.length === 0
                                ) {
                                  newItems[index].options = [
                                    { choice_text: "", is_correct: false },
                                  ];
                                }
                                setItems(newItems);
                              }}
                            >
                              <option value="multiple_choice">객관식</option>
                              <option value="short_answer">단답형</option>
                              <option value="long_answer">서술형</option>
                            </select>
                          </div>

                          <div className="mt-10 flex flex-col gap-3">
                            <span className="font-semibold">배점</span>
                            <Input
                              className="w-1/2 h-10"
                              name="questionPoint"
                              value={item.questionPoint}
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].questionPoint =
                                  parseInt(e.target.value) || 0;
                                setItems(newItems);
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-3">
                          <span className="font-semibold">문제 작성</span>
                          <Textarea
                            name="questionText"
                            value={item.question}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].question = e.target.value;
                              setItems(newItems);
                            }}
                          />
                        </div>

                        <div className="mt-10 flex flex-col gap-3">
                          <span className="font-semibold">
                            사진 / 동영상 첨부
                          </span>
                          <Input type="file" name="questionMedia" />
                        </div>

                        {item.questionType === "multiple_choice" && (
                          <div className="mt-10 flex flex-col gap-3">
                            <span className="font-semibold">선지 작성</span>
                            {item.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={option.choice_text}
                                  name={`questionChoices[${optIdx}].choice_text`}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].options[
                                      optIdx
                                    ].choice_text = e.target.value;
                                    setItems(newItems);
                                  }}
                                />
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={option.is_correct}
                                    name={`questionChoices[${optIdx}].is_correct`}
                                    onChange={(e) => {
                                      const newItems = [...items];
                                      newItems[index].options.forEach((opt) => {
                                        opt.is_correct = false;
                                      });
                                      newItems[index].options[
                                        optIdx
                                      ].is_correct = e.target.checked;
                                      setItems(newItems);
                                    }}
                                  />
                                  <span className="ml-2">정답</span>
                                </label>
                              </div>
                            ))}
                            <Button
                              className="rounded-full w-fit self-center"
                              variant="ghost"
                              onClick={(e) => {
                                e.preventDefault();
                                const newItems = [...items];
                                newItems[index].options.push({
                                  choice_text: "",
                                  is_correct: false,
                                });
                                setItems(newItems);
                              }}
                            >
                              <Plus className="size-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Form>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
