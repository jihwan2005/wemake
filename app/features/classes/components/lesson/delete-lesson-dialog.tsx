import { LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";
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

type Lesson = {
  lesson_id: string;
  title: string | null;
};

export default function DeleteLessonDialog({ lesson }: { lesson: Lesson }) {
  const navigation = useNavigation();
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] =
    useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <Dialog
      open={isDeleteLessonDialogOpen}
      onOpenChange={setIsDeleteLessonDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedLesson({
              id: lesson.lesson_id,
              title: lesson.title + "",
            });
            setIsDeleteLessonDialogOpen(true);
          }}
        >
          <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>레슨 삭제하기</DialogTitle>
        <DialogDescription>
          정말 <span>{selectedLesson?.title}</span> 레슨 삭제하시겠습니까?
        </DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => setIsDeleteLessonDialogOpen(false)}
          >
            취소하기
          </Button>
          <Form method="post">
            <input type="hidden" name="actionType" value="delete-lesson" />
            <input type="hidden" name="lessonId" value={lesson.lesson_id} />
            <Button
              id="delete-lesson"
              className="bg-primary"
              type="submit"
              name="delete-lesson"
              value="delete-lesson"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "레슨 삭제"
              )}
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
