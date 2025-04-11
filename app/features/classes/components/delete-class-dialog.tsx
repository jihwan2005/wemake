import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Button } from "~/common/components/ui/button";
import { Form } from "react-router";
import { useState } from "react";
import { LoaderCircle, Trash } from "lucide-react";
import { useNavigation } from "react-router";

export default function DeleteClassDialog() {
  const [isDeleteClassDialogOpen, setIsDeleteClassDialogOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <Dialog
      open={isDeleteClassDialogOpen}
      onOpenChange={setIsDeleteClassDialogOpen}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsDeleteClassDialogOpen(true)}>
          <Trash className="size-4" />
          Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Class 삭제하기</DialogTitle>
        <DialogDescription>Class를 정말 삭제하시겠습니까?</DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => setIsDeleteClassDialogOpen(false)}
          >
            취소하기
          </Button>
          <Form method="post">
            <input type="hidden" name="actionType" value="delete" />
            <Button
              id="delete"
              className="bg-primary"
              type="submit"
              name="delete"
              value="delete"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Class 삭제"
              )}
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
