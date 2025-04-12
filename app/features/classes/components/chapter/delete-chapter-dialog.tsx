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

type Chapter = {
  chapter_id: string;
  title: string | null;
};

export default function DeleteChapterDialog({ course }: { course: Chapter }) {
  const navigation = useNavigation();
  const [isDeleteChapterDialogOpen, setIsDeleteChapterDialogOpen] =
    useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <Dialog
      open={isDeleteChapterDialogOpen}
      onOpenChange={setIsDeleteChapterDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedChapter({
              id: course.chapter_id,
              title: course.title + "",
            });
            setIsDeleteChapterDialogOpen(true);
          }}
        >
          <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>챕터 삭제하기</DialogTitle>
        <DialogDescription>
          정말 <span>{selectedChapter?.title}</span> 챕터 삭제하시겠습니까?
        </DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => setIsDeleteChapterDialogOpen(false)}
          >
            취소하기
          </Button>
          <Form method="post">
            <input type="hidden" name="actionType" value="delete-chapter" />
            <input type="hidden" name="chapterId" value={course.chapter_id} />
            <Button
              id="delete-chapter"
              className="bg-primary"
              type="submit"
              name="delete-chapter"
              value="delete-chapter"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "챕터 삭제"
              )}
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
