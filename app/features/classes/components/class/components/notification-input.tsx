import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import { useFetcher } from "react-router";

interface NotificationInputProps {
  classId: string;
}

export function NotificationInput({ classId }: NotificationInputProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action={`/classes/${classId}`}>
      <input type="hidden" name="actionType" value="create-notification" />
      <Input className="bg-white mb-3" id="notification" name="notification" />
      <Button className="mb-3">공지사항 올리기</Button>
    </fetcher.Form>
  );
}
