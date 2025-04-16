// components/goal/goal-input.tsx
import { useFetcher } from "react-router";
import { Input } from "~/common/components/ui/input";
import { useEffect, useState } from "react";

export default function GoalInput({ classId }: { classId: string }) {
  const fetcher = useFetcher();
  const [goalText, setGoalText] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle") {
      setGoalText("");
    }
  }, [fetcher.state]);

  return (
    <fetcher.Form
      className="w-full"
      method="post"
      action={`/classes/${classId}`}
    >
      <input type="hidden" name="actionType" value="create-goal" />
      <Input
        className="bg-white"
        id="goal"
        name="goal"
        value={goalText}
        onChange={(e) => setGoalText(e.target.value)}
        placeholder="목표 입력하기"
      />
    </fetcher.Form>
  );
}
