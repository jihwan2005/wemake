// components/goal/goal-list.tsx
import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import DeleteGoalDialog from "../delete-goal-dialog";
import UpdateGoalDialog from "../update-goal-dialog";
import { useFetcher } from "react-router";
import { Checkbox } from "~/common/components/ui/checkbox";
import { useState } from "react";

export default function GoalList({
  goals,
  classId,
}: {
  goals: {
    class_post_id: number;
    created_at: string;
    goal_id: string;
    goal_text: string;
    profile_id: string;
    is_checked: boolean;
  }[];
  classId: string;
}) {
  const fetcher = useFetcher();
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const handleCheck = (goalId: string, newChecked: boolean) => {
    setCheckedMap((prev) => ({
      ...prev,
      [goalId]: newChecked,
    }));

    fetcher.submit(
      {
        goalId,
        actionType: "check-goal",
      },
      {
        method: "post",
        action: `/classes/${classId}`,
      }
    );
  };
  return (
    <>
      {goals.map((goal, index) => (
        <div
          key={index}
          className="bg-white w-11/12 h-[40px] rounded-md mt-5 mx-auto flex items-center justify-center"
        >
          <div className="flex items-center justify-between w-full px-3">
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={goal.is_checked}
                onCheckedChange={(newChecked) =>
                  handleCheck(goal.goal_id, !!newChecked)
                }
                className="size-4"
              />
              <span className={goal.is_checked ? "line-through" : ""}>
                {goal.goal_text}
              </span>
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
