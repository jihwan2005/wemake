import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import MyCalendar from "../../utils/big-calendar";
import { Button } from "~/common/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { useOutletContext } from "react-router";

type Attendance = {
  class_post_id: number;
  date: string;
  is_attended: boolean;
  profile_id: string;
};

export default function ClassAttendanceDialog({
  classId,
  attendance,
  startAt,
  endAt,
}: {
  classId: string;
  startAt: string;
  endAt: string;
  attendance: Attendance[];
}) {
  const { username } = useOutletContext<{ username: string }>();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <CalendarCheck className="size-4" />
          출석부
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-2xl">{username}님의 출석부</DialogHeader>
        <MyCalendar
          classId={classId}
          attendance={attendance}
          startAt={startAt}
          endAt={endAt}
        />
      </DialogContent>
    </Dialog>
  );
}
