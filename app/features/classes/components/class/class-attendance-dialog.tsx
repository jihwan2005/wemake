import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import MyCalendar from "../../utils/big-calendar";
import { Button } from "~/common/components/ui/button";
import { CalendarCheck } from "lucide-react";

type Attendance = {
  class_post_id: number;
  date: string;
  is_attended: boolean;
  profile_id: string;
};
export default function ClassAttendanceDialog({
  classId,
  attendance,
}: {
  classId: string;
  attendance: Attendance[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <CalendarCheck className="size-4" />
          출석부
        </Button>
      </DialogTrigger>
      <DialogContent>
        <MyCalendar classId={classId} attendance={attendance} />
      </DialogContent>
    </Dialog>
  );
}
