import { Form } from "react-router";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Upload } from "lucide-react";
import React, { Suspense } from "react";

// 클라이언트 사이드에서만 react-datepicker 불러오기
const DatePicker = React.lazy(() => import("react-datepicker"));
import "react-datepicker/dist/react-datepicker.css";

interface ClassQuizInfoProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export function ClassQuizInfo({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ClassQuizInfoProps) {
  const isClient = typeof window !== "undefined";

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <Upload className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
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

              {isClient && (
                <Suspense
                  fallback={<div>날짜 선택 컴포넌트를 불러오는 중...</div>}
                >
                  <div className="flex gap-4">
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
                </Suspense>
              )}

              <div>
                <span>제한 시간(분)</span>
                <Input name="limitTime" />
              </div>
              <Button>저장하기</Button>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
