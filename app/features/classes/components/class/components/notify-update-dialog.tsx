import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";

export default function NotifyUpdateDialog({
  title,
  content,
  classId,
  notifyId,
  authorId,
  userId,
}: {
  title: string;
  content: string | null;
  classId: string;
  notifyId: number;
  authorId?: string;
  userId?: string;
}) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {authorId === userId && (
          <Button variant="outline">
            <Pencil className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>수정하기</DialogHeader>
        <div className="flex flex-col gap-2">
          <fetcher.Form method="post" action={`/classes/${classId}`}>
            <input type="hidden" name="actionType" value="update-notify" />
            <input type="hidden" name="notify_id" value={notifyId + ""} />
            <label htmlFor="title">제목</label>
            <Input
              type="text"
              id="title"
              name="title"
              defaultValue={title}
              className="border border-gray-300 rounded p-2 my-2"
            />
            <label htmlFor="content">내용</label>
            <Textarea
              id="content"
              name="content"
              defaultValue={content ?? ""}
              className="border border-gray-300 rounded p-2 mt-2"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={() => setOpen(false)}>수정하기</Button>
            </div>
          </fetcher.Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
