import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/common/components/ui/carousel";
import { Card, CardContent } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Plus } from "lucide-react";
import { Form, useFetcher, useNavigation } from "react-router";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-upload-page";
import { createQuizQuestion, updateQuizQuestion } from "../data/mutations";
import { getClassQuestionByQuizId } from "../data/queries";
import ClassQuestionTypeSelect from "./components/quiz/question/ClassQuestionTypeSelect";
import ClassQuestionPointInput from "./components/quiz/question/ClassQuestionPointInput";
import ClassQuestionTextTextArea from "./components/quiz/question/ClassQuestionTextTextArea";
import ClassQuestionChoiceInput from "./components/quiz/question/ClassQuestionChoiceInput";
import ClassQuestionMediaInput from "./components/quiz/question/ClassQuestionMediaInput";
import ClassQuestionHintInput from "./components/quiz/question/ClassQuestionHintInput";
import { useActionData } from "react-router";
import ClassQuestionPositionInput from "./components/quiz/question/ClassQuestionPositionInput";
import ClassQuestionHandleButton from "./components/quiz/question/ClassQuestionHandleButton";
import { useCarouselSync } from "../hooks/useCarouselSync";
import { useHandleDeleteEffect } from "../hooks/useHandleDeleteEffect";
import { useSuccessAlert } from "../hooks/useSuccessAlert";
import ClassQuestionMinLengthInput from "./components/quiz/question/ClassQuestionMinLengthInput";

type QuizItem = {
  question: string;
  questionType: "multiple_choice" | "short_answer" | "long_answer";
  questionPoint: number;
  options: Choice[];
  question_position: number;
  questionId?: number;
  questionHint: string;
  questionMinLength?: number;
};

type Choice = {
  choice_text: string;
  is_correct: boolean;
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const quizId = params.quizId;
  const classId = params.classId;
  const questions = await getClassQuestionByQuizId(client, {
    quizId,
  });
  return { questions, quizId, classId };
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
  const questionId = formData.get("questionId") as string;
  const minLength = formData.get("questionMinLength") as string;
  const hint = formData.get("questionHint") as string;
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

  if (questionId) {
    await updateQuizQuestion(client, {
      questionId,
      text,
      point,
      type,
      position,
      choices,
      hint,
      minLength,
    });
    return { success: true, message: "문제 수정 완료!" };
  } else {
    const createdQuestionId = await createQuizQuestion(client, {
      quizId,
      text,
      point,
      type,
      position,
      choices,
      hint,
      minLength,
    });
    return {
      success: true,
      message: "문제 생성 완료!",
      questionId: createdQuestionId,
    };
  }
};

export default function ClassQuizUploadPage({
  loaderData,
}: Route.ComponentProps) {
  const [items, setItems] = useState<QuizItem[]>(
    loaderData.questions.map((q: any) => ({
      question: q.question_text,
      questionType: q.question_type,
      questionPoint: q.question_point,
      question_position: q.question_position,
      options: q.class_quiz_choices || [],
      questionId: q.question_id,
      questionHint: q.question_hint,
      questionMinLength: q.question_min_length ?? 0,
    }))
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  useCarouselSync(api, setCount, setCurrent);
  useHandleDeleteEffect({
    fetcherData: fetcher.data,
    deleteIndex,
    setItems,
    api,
    setCurrent,
    resetDeleteIndex: () => setDeleteIndex(null),
  });
  useSuccessAlert({ actionData, current, setItems });

  const handleAddItem = () => {
    const newItem: QuizItem = {
      question: "",
      questionHint: "",
      questionType: "multiple_choice",
      questionPoint: 1,
      options: [{ choice_text: "", is_correct: false }],
      question_position: items.length,
      questionMinLength: 0,
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

  const handleDeleteItem = (index: number) => {
    const item = items[index];

    if (item.questionId) {
      // 삭제할 항목 인덱스를 저장
      setDeleteIndex(index);

      fetcher.submit(
        { questionId: String(item.questionId) },
        {
          method: "POST",
          action: `/classes/${loaderData.classId}/quiz/${loaderData.quizId}/delete`,
        }
      );
    } else {
      // questionId가 없으면 그냥 클라이언트에서 삭제
      setItems((prevItems) => {
        const newItems = [...prevItems];
        newItems.splice(index, 1);
        return newItems;
      });

      setTimeout(() => {
        const newIndex = Math.max(0, index - 1);
        api?.scrollTo(newIndex);
        setCurrent(newIndex + 1);
      }, 0);
    }
  };

  return (
    <div className="space-y-20 flex justify-center w-full">
      <div className="w-1/2 bg-amber-100 h-[1000px] flex flex-col items-center gap-4 rounded-md pt-10">
        <Button className="rounded-full" onClick={handleAddItem} type="button">
          <Plus className="size-6" />
        </Button>
        <div className="flex gap-2 flex-wrap justify-center">
          {items.map((_, index) => (
            <Button
              key={index}
              variant={current === index + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => api?.scrollTo(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <Carousel className="w-7/8" setApi={setApi}>
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <Form
                  method="post"
                  className="w-full"
                  encType="multipart/form-data"
                >
                  {item.questionId && (
                    <input
                      type="hidden"
                      name="questionId"
                      value={item.questionId}
                    />
                  )}

                  <Card>
                    <CardContent className="relative w-full h-[650px] flex justify-center text-xl overflow-y-auto max-h-screen">
                      <div className="absolute top-0 right-7 text-md text-white bg-black px-4 py-1 rounded-full">
                        {current}/{count}
                      </div>

                      <div className="flex flex-col w-full gap-1">
                        <ClassQuestionHandleButton
                          isSubmitting={isSubmitting}
                          hasQuestionId={!!item.questionId}
                          onDelete={() => handleDeleteItem(index)}
                        />

                        <ClassQuestionTypeSelect
                          value={item.questionType}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].questionType = e.target
                              .value as QuizItem["questionType"];
                            setItems(newItems);
                          }}
                        />

                        <div className="flex items-center">
                          <ClassQuestionPositionInput
                            value={item.question_position}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].question_position =
                                parseInt(e.target.value) || 0;
                              setItems(newItems);
                            }}
                          />

                          <ClassQuestionPointInput
                            value={item.questionPoint}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].questionPoint =
                                parseInt(e.target.value) || 0;
                              setItems(newItems);
                            }}
                          />
                        </div>

                        <ClassQuestionTextTextArea
                          value={item.question}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].question = e.target.value;
                            setItems(newItems);
                          }}
                        />

                        {item.questionType === "long_answer" && (
                          <ClassQuestionMinLengthInput
                            value={item.questionMinLength ?? 0}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].questionMinLength =
                                parseInt(e.target.value) || 0;
                              setItems(newItems);
                            }}
                          />
                        )}

                        <ClassQuestionMediaInput
                          onClickImage={() => {
                            // TODO: 이미지 추가 핸들러
                          }}
                          onClickVideo={() => {
                            // TODO: 비디오 추가 핸들러
                          }}
                        />

                        {item.questionType === "multiple_choice" && (
                          <ClassQuestionChoiceInput
                            options={item.options}
                            onTextChange={(optIdx, e) => {
                              const newItems = [...items];
                              newItems[index].options[optIdx].choice_text =
                                e.target.value;
                              setItems(newItems);
                            }}
                            onCorrectChange={(optIdx, e) => {
                              const newItems = [...items];
                              newItems[index].options.forEach((opt) => {
                                opt.is_correct = false;
                              });
                              newItems[index].options[optIdx].is_correct =
                                e.target.checked;
                              setItems(newItems);
                            }}
                            onAddChoice={(e) => {
                              e.preventDefault();
                              const newItems = [...items];
                              newItems[index].options.push({
                                choice_text: "",
                                is_correct: false,
                              });
                              setItems(newItems);
                            }}
                          />
                        )}

                        <ClassQuestionHintInput
                          value={item.questionHint}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].questionHint = e.target.value;
                            setItems(newItems);
                          }}
                        />
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
