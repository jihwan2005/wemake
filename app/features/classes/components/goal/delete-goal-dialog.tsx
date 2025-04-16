import { LoaderCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";

export default function DeleteGoalDialog({
  goalId,
  text,
}: {
  goalId: string;
  text: string;
}) {
  const navigation = useNavigation();
  const [isDeleteGoalDialogOpen, setIsDeleteGoalDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  useEffect(() => {
    if (navigation.state === "idle") {
      setIsDeleteGoalDialogOpen(false);
    }
  }, [navigation.state]);
  return (
    <Dialog
      open={isDeleteGoalDialogOpen}
      onOpenChange={setIsDeleteGoalDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedChapter({
              id: goalId,
              text: text + "",
            });
            setIsDeleteGoalDialogOpen(true);
          }}
        >
          <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>목표 삭제하기</DialogTitle>
        <DialogDescription>
          정말 <span>{selectedChapter?.text}</span> 목표 삭제하시겠습니까?
        </DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => setIsDeleteGoalDialogOpen(false)}
          >
            취소하기
          </Button>
          <Form method="post">
            <input type="hidden" name="actionType" value="delete-goal" />
            <input type="hidden" name="goalId" value={goalId} />
            <Button
              id="delete-goal"
              className="bg-primary"
              type="submit"
              name="delete-goal"
              value="delete-goal"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "목표 삭제"
              )}
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
