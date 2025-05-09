import { makeSSRClient } from "~/supa-client";
import { getClassQuizStudentText } from "../data/queries";
import type { Route } from "./+types/class-quiz-score-page";
import { useEffect, useState } from "react";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/common/components/ui/carousel";
import { Form, useActionData } from "react-router";
import { createClassQuizScore } from "../data/mutations";
import { useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";

type Answer = {
  answer_id: number;
  question_id: number;
  question_text: string;
  question_point: number;
  question_position: number;
  question_type: string;
  answer_text: string | null;
  confidence_level: string;
  final_score?: number;
  score_reason?: string;
  dispute_text?: string;
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
  const hadScore = formData.get("hadScore") === "true";
  const hadReason = formData.get("hadReason") === "true";
  await createClassQuizScore(client, {
    answerId,
    score,
    reason,
  });
  return {
    success: true,
    message: hadScore || hadReason ? "수정 완료!" : "제출 완료!",
  };
};

export default function ClassQuizScorePage({
  loaderData,
}: ClassQuizScorePageProps) {
  // 상태 관리: 선택된 학생
  const [selectedStudent, setSelectedStudent] = useState<StudentAnswer | null>(
    null
  );
  const [selectedStudentDispute, setSelectedStudentDispute] =
    useState<StudentAnswer | null>(null);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
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

  const handleStudentDisputeClick = (student: StudentAnswer) => {
    if (selectedStudentDispute?.profile_id === student.profile_id) {
      // 이미 선택된 학생을 다시 클릭하면 선택 해제
      setSelectedStudentDispute(null);
    } else {
      setSelectedStudentDispute(student);
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
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.message) {
      alert(actionData.message);
    }
  }, [actionData]);
  return (
    <div className="flex justify-center">
      <div className="space-y-20 p-6">
        <div className="flex space-x-8 flex-col">
          <div className="flex items-center gap-2">
            <div>
              <strong>답안 내용</strong>
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
            </div>

            {selectedStudent && (
              <div className="border p-4">
                <h3 className="mb-3">
                  {selectedStudent.username}의 서술형 답변
                </h3>
                <Carousel>
                  <CarouselContent>
                    {selectedStudent.answers.map((answer) => (
                      <CarouselItem>
                        <Form method="post">
                          <div key={answer.answer_id} className="space-y-2">
                            <p>
                              <strong>문제: </strong>
                              {answer.question_text}
                            </p>
                            <p>
                              <strong>번호: </strong>
                              {answer.question_position}
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
                                  defaultValue={
                                    answer.final_score === 0.0
                                      ? "0"
                                      : answer.final_score
                                  }
                                  onChange={(e) =>
                                    handleScoreChange(
                                      answer.question_id,
                                      Number(e.target.value),
                                      answer.question_point
                                    )
                                  }
                                />
                                <input
                                  type="hidden"
                                  name="hadScore"
                                  value={answer.final_score ? "true" : "false"}
                                />
                                <Input
                                  className="w-3/5"
                                  placeholder="점수를 준 이유 (선택)"
                                  defaultValue={answer.score_reason || ""}
                                  name="reason"
                                />
                                <input
                                  type="hidden"
                                  name="hadReason"
                                  value={answer.score_reason ? "true" : "false"}
                                />
                                <Button type="submit" disabled={isSubmitting}>
                                  {isSubmitting ? (
                                    <LoaderCircle className="animate-spin h-4 w-4" />
                                  ) : answer.final_score ||
                                    answer.score_reason ? (
                                    "수정"
                                  ) : (
                                    "저장"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}
          </div>

          <div className="mt-20">
            <div className="flex items-center gap-2">
              <div>
                <strong>이의 신청</strong>
                <div className="border p-4">
                  <h2>학생 목록</h2>
                  <div>
                    {loaderData.answers.map((student) => (
                      <div
                        key={student.profile_id}
                        className="cursor-pointer"
                        onClick={() => handleStudentDisputeClick(student)}
                      >
                        <span>{student.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedStudentDispute && (
                <div className="border p-4">
                  <h3 className="mb-3">
                    {selectedStudentDispute.username}의 이의 신청
                  </h3>
                  <Carousel>
                    <CarouselContent>
                      {selectedStudentDispute.answers.map((answer) => (
                        <CarouselItem>
                          <p>
                            <strong>문제 :</strong>
                            {answer.question_position}
                          </p>
                          <p>
                            <strong>이의 신청 내용: </strong>
                            {answer.dispute_text}
                          </p>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
