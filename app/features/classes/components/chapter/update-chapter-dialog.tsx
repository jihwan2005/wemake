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
  order: number | null;
};

export default function UpdateChapterDialog({ course }: { course: Chapter }) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const [updateChapterDialogOpen, setUpdateChapterDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{
    id: string;
    title: string;
    order: number;
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
              order: course.order ?? 0,
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
          <div className="flex flex-col gap-2 mb-5">
            <span>제목 바꾸기</span>
            <Input
              defaultValue={selectedChapter?.title}
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
              defaultValue={selectedChapter?.order}
              id="order"
              name="order"
            />
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setUpdateChapterDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setUpdateChapterDialogOpen(false)}
            >
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
