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
  order: number | null;
};

export default function UpdateLessonDialog({ lesson }: { lesson: Lesson }) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const [updateLessonDialogOpen, setUpdateLessonDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    id: string;
    title: string;
    order: number;
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
              order: lesson.order ?? 0,
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
          <div className="flex flex-col gap-2 mb-5">
            <span>제목 바꾸기</span>
            <Input
              defaultValue={selectedLesson?.title}
              id="title"
              name="title"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span>순서 바꾸기</span>
            <span className="text-sm text-gray-500">
              숫자 크기 순으로 정렬됩니다
            </span>
            <Input
              defaultValue={selectedLesson?.order}
              id="order"
              name="order"
            />
          </div>
          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setUpdateLessonDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setUpdateLessonDialogOpen(false)}
            >
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
