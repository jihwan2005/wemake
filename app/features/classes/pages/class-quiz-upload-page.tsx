import { Form } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Textarea } from "~/common/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-upload-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { createClassQuiz } from "../data/mutations";

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

export default function ClassQuizUploadPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="flex justify-center w-full">
      <Form method="post">
        <div className="flex flex-col gap-3 w-full">
          <div>
            <span>퀴즈 제목</span>
            <Input name="title" />
          </div>
          <div className="flex flex-col gap-3">
            <span>퀴즈 설명</span>
            <Label>유의 사항, 문제 수, 시험 범위 ...</Label>
            <Textarea name="description" />
          </div>
          <div className="flex">
            <div className="flex flex-col gap-2">
              <span>시작일</span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                minDate={new Date()}
                dateFormat="yyyy-MM-dd HH:mm"
                timeIntervals={1}
                showIcon
                name="startDate"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>종료일</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                minDate={startDate || new Date()}
                minTime={
                  endDate && startDate && isSameDay(endDate, startDate)
                    ? startDate
                    : new Date(0, 0, 0, 0, 0)
                }
                maxTime={new Date(0, 0, 0, 23, 59)}
                timeIntervals={1}
                showIcon
                name="endDate"
              />
            </div>
          </div>
          <div>
            <span>제한 시간(분)</span>
            <Input name="limitTime" />
          </div>
          <Button>저장하기</Button>
        </div>
      </Form>
    </div>
  );
}
