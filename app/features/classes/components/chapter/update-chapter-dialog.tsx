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

type Chapter = {
  chapter_id: string;
  title: string | null;
};

export default function UpdateChapterDialog({ course }: { course: Chapter }) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const [updateChapterDialogOpen, setUpdateChapterDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{
    id: string;
    title: string;
  } | null>(null);
  return (
    <Dialog
      open={updateChapterDialogOpen}
      onOpenChange={setUpdateChapterDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedChapter({
              id: course.chapter_id,
              title: course.title + "",
            });
            setUpdateChapterDialogOpen(true);
          }}
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Update Class</DialogTitle>
          <DialogDescription>
            Update information of your class
          </DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <input type="hidden" name="actionType" value="update-chapter" />
          <input
            type="hidden"
            name="chapter_id"
            value={selectedChapter?.id ?? ""}
          />
          <Input
            defaultValue={selectedChapter?.title}
            id="title"
            name="title"
          />
          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setUpdateChapterDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                "Rename Chapter"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
