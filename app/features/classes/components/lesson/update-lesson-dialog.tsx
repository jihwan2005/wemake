import { LoaderCircle, Pencil } from "lucide-react";
import { useState } from "react";
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

type Lesson = {
  lesson_id: string;
  title: string | null;
};

export default function UpdateLessonDialog({ lesson }: { lesson: Lesson }) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const [updateLessonDialogOpen, setUpdateLessonDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);
  return (
    <Dialog
      open={updateLessonDialogOpen}
      onOpenChange={setUpdateLessonDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedLesson({
              id: lesson.lesson_id,
              title: lesson.title + "",
            });
            setUpdateLessonDialogOpen(true);
          }}
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Update Lesson</DialogTitle>
          <DialogDescription>
            Lesson information of your class
          </DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <input type="hidden" name="actionType" value="update-lesson" />
          <input
            type="hidden"
            name="lesson_id"
            value={selectedLesson?.id ?? ""}
          />
          <Input defaultValue={selectedLesson?.title} id="title" name="title" />
          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setUpdateLessonDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                "Rename Lesson"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
