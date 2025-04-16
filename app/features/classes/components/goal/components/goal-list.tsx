// components/goal/goal-list.tsx
import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import DeleteGoalDialog from "../delete-goal-dialog";
import UpdateGoalDialog from "../update-goal-dialog";
import { Form } from "react-router";
import { Checkbox } from "~/common/components/ui/checkbox";

export default function GoalList({
  goals,
}: {
  goals: {
    class_post_id: number;
    created_at: string;
    goal_id: string;
    goal_text: string;
    profile_id: string;
  }[];
}) {
  return (
    <>
      {goals.map((goal, index) => (
        <div
          key={index}
          className="bg-white w-11/12 h-[40px] rounded-md mt-5 mx-auto flex items-center justify-center"
        >
          <div className="flex items-center justify-between w-full px-3">
            <div className="flex gap-2 items-center">
              <Form>
                <Checkbox className="size-4" />
              </Form>
              <span>{goal.goal_text}</span>
            </div>
            <Popover>
              <PopoverTrigger>
                <MoreVertical className="size-6" />
              </PopoverTrigger>
              <PopoverContent className="w-40 h-25 flex flex-col gap-2 items-center justify-center">
                <div className="flex gap-3 items-center">
                  <span>수정하기</span>
                  <UpdateGoalDialog
                    goalId={goal.goal_id}
                    text={goal.goal_text}
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <span>삭제하기</span>
                  <DeleteGoalDialog
                    goalId={goal.goal_id}
                    text={goal.goal_text}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}
    </>
  );
}
