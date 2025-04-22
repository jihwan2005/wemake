import { LoaderCircle, Upload } from "lucide-react";
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
import { Label } from "~/common/components/ui/label";
import { Switch } from "~/common/components/ui/switch";

export default function CreateLessonDialog({
  chapterId,
}: {
  chapterId: string;
}) {
  const [createLessonDialogOpen, setCreateLessonDialogOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <Dialog
      open={createLessonDialogOpen}
      onOpenChange={setCreateLessonDialogOpen}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setCreateLessonDialogOpen(true)}>
          <Upload className="size-4" />
          Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
          <DialogDescription>Wrtie lesson of your class</DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <input type="hidden" name="actionType" value="create-lesson" />
          <input type="hidden" name="chapterId" value={chapterId} />
          <Input
            id="lesson"
            name="lesson"
            placeholder="Lesson Title"
            className="mb-3"
          />
          <Input
            id="lessonVideo"
            name="lessonVideo"
            placeholder="Lessson Video"
            type="file"
          />
          <div className="flex items-center space-x-2 mt-3">
            <Switch id="isHidden" name="isHidden" />
            <Label htmlFor="isHidden">히든 강의로 만들기</Label>
          </div>
          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setCreateLessonDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setCreateLessonDialogOpen(false)}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                "Create Lesson"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
