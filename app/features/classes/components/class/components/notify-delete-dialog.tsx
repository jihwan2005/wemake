import { Trash } from "lucide-react";
import { useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/common/components/ui/dialog";

export default function NotifyDeleteDialog({
  title,
  classId,
  notifyId,
  authorId,
  userId,
}: {
  title: string;
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
            <Trash className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>삭제하기</DialogHeader>
        <div className="flex flex-col gap-2">
          <fetcher.Form method="post" action={`/classes/${classId}`}>
            <input type="hidden" name="actionType" value="delete-notify" />
            <input type="hidden" name="notify_id" value={notifyId + ""} />
            <label htmlFor="title">정말 {title}을 삭제하겠습니까?</label>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setOpen(false)} className="mr-3">
                취소하기
              </Button>
              <Button onClick={() => setOpen(false)}>삭제하기</Button>
            </div>
          </fetcher.Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
