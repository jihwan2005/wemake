import { LoaderCircle, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";

export default function UpdateGoalDialog({
  goalId,
  text,
}: {
  goalId: string;
  text: string;
}) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const [updateGoalDialogOpen, setUpdateGoalDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{
    id: string;
    text: string;
  } | null>(null);
  useEffect(() => {
    if (navigation.state === "idle") {
      setUpdateGoalDialogOpen(false);
    }
  }, [navigation.state]);
  return (
    <Dialog open={updateGoalDialogOpen} onOpenChange={setUpdateGoalDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedChapter({
              id: goalId,
              text: text + "",
            });
            setUpdateGoalDialogOpen(true);
          }}
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>목표 수정</DialogTitle>
          <DialogDescription>목표를 수정해주세요</DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <input type="hidden" name="actionType" value="update-goal" />
          <input
            type="hidden"
            name="goalId"
            value={selectedChapter?.id ?? ""}
          />
          <Input defaultValue={selectedChapter?.text} id="text" name="text" />
          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setUpdateGoalDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                "수정하기"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
