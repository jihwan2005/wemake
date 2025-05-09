import { makeSSRClient } from "~/supa-client";
import { getClassQuizStudentText } from "../data/queries";
import type { Route } from "./+types/class-quiz-score-page";
import { useState } from "react";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/common/components/ui/carousel";
import { Form } from "react-router";
import { createClassQuizScore } from "../data/mutations";

type Answer = {
  answer_id: number;
  question_id: number;
  question_text: string;
  question_point: number;
  question_position: number;
  question_type: string;
  answer_text: string | null;
  confidence_level: string;
};

type StudentAnswer = {
  quiz_id: number;
  profile_id: string;
  username: string;
  answers: Answer[];
};

type ClassQuizScorePageProps = {
  loaderData: {
    answers: StudentAnswer[];
  };
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const answers = await getClassQuizStudentText(client, {
    quizId: params.quizId,
  });
  return { answers };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const answerId = formData.get("answerId") as string;
  const score = formData.get("score") as string;
  const reason = formData.get("reason") as string;
  await createClassQuizScore(client, {
    answerId,
    score,
    reason,
  });
};

export default function ClassQuizScorePage({
  loaderData,
}: ClassQuizScorePageProps) {
  // 상태 관리: 선택된 학생
  const [selectedStudent, setSelectedStudent] = useState<StudentAnswer | null>(
    null
  );
  const [inputScores, setInputScores] = useState<Record<number, number>>({});
  // 학생 이름 클릭 시 해당 학생의 답변을 보여주기
  const handleStudentClick = (student: StudentAnswer) => {
    if (selectedStudent?.profile_id === student.profile_id) {
      // 이미 선택된 학생을 다시 클릭하면 선택 해제
      setSelectedStudent(null);
    } else {
      setSelectedStudent(student);
    }
  };

  const handleScoreChange = (
    questionId: number,
    value: number,
    maxScore: number
  ) => {
    // 점수가 배점보다 크지 않도록 제어
    if (value <= maxScore) {
      setInputScores((prevScores) => ({
        ...prevScores,
        [questionId]: value,
      }));
    }
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-20 p-6">
        <div className="flex space-x-8">
          <div className="border p-4">
            <h2>학생 목록</h2>
            <div>
              {loaderData.answers.map((student) => (
                <div
                  key={student.profile_id}
                  className="cursor-pointer"
                  onClick={() => handleStudentClick(student)}
                >
                  <span>{student.username}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 학생 선택 후 서술형 답변을 표시 */}
          {selectedStudent && (
            <div className="border p-4">
              <h3 className="mb-3">{selectedStudent.username}의 서술형 답변</h3>
              <Carousel>
                <CarouselContent>
                  {selectedStudent.answers.map((answer) => (
                    <CarouselItem>
                      <Form method="post">
                        <div key={answer.answer_id} className="space-y-2">
                          <p>
                            <strong>질문: </strong>
                            {answer.question_text}
                          </p>
                          <p>
                            <strong>배점: </strong>
                            {answer.question_point}
                          </p>
                          <p>
                            <strong>답변: </strong>
                            {answer.answer_text ?? "미작성"}
                          </p>
                          <div>
                            <strong>
                              점수 입력(0 ~ 배점, 소수점 한 자리수까지만 허용)
                            </strong>
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="hidden"
                                name="answerId"
                                value={answer.answer_id}
                              />
                              <Input
                                className="w-1/5"
                                name="score"
                                placeholder="점수"
                                onChange={(e) =>
                                  handleScoreChange(
                                    answer.question_id,
                                    Number(e.target.value),
                                    answer.question_point
                                  )
                                }
                              />
                              <Input
                                className="w-3/5"
                                placeholder="점수를 준 이유 (선택)"
                                name="reason"
                              />
                              <Button type="submit">저장</Button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
