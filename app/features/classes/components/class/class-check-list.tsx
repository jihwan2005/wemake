import { ListCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import GoalInput from "../goal/components/goal-input";
import GoalList from "../goal/components/goal-list";

export default function ClassCheckList({
  classId,
  goals,
}: {
  classId: string;
  goals: {
    class_post_id: number;
    created_at: string;
    goal_id: string;
    goal_text: string;
    profile_id: string;
  }[];
}) {
  const fetcher = useFetcher();
  const [goalText, setGoalText] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle") {
      setGoalText("");
    }
  }, [fetcher.state]);
  return (
    <div className="w-full bg-gray-300 rounded-2xl min-h-[200px] relative pb-5">
      <div className="pt-5 text-[20px] flex items-center justify-center gap-2">
        <ListCheck className="size-6" />
        <span>오늘의 목표</span>
      </div>
      <div className="flex gap-3 mt-3 px-3 justify-center">
        <GoalInput classId={classId} />
      </div>

      <GoalList goals={goals} />
    </div>
  );
}
