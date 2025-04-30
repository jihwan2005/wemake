import { EllipsisVertical } from "lucide-react";
import { DateTime } from "luxon";
import { Form, useFetcher, useOutletContext } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { Button } from "~/common/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "~/common/components/ui/input";

interface MessageBubbleProps {
  avatarUrl: string;
  avatarFallback: string;
  content: string;
  isCurrentUser?: boolean;
  isRead: boolean;
  isDelete: boolean;
  isEdited: boolean;
  readAt: string;
  senderId: string;
  messageId: number;
}

export function ClassMessageBubble({
  avatarUrl,
  avatarFallback,
  content,
  isRead,
  isDelete,
  isCurrentUser = false,
  readAt,
  senderId,
  messageId,
  isEdited,
}: MessageBubbleProps) {
  const { userId } = useOutletContext<{ userId: string }>();
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(content); // 기존 메시지로 초기화
  };

  useEffect(() => {
    if (fetcher.state === "idle" && isEditing) {
      // 수정 완료된 후
      setIsEditing(false);
    }
  }, [fetcher.state]);

  return (
    <div
      className={cn(
        "flex items-end gap-4",
        isCurrentUser ? "flex-row-reverse" : ""
      )}
    >
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div
        className={cn({
          "rounded-md p-4 text-sm w-1/4": true,
          "bg-accent rounded-br-none": isCurrentUser,
          "bg-primary text-primary-foreground rounded-bl-none": !isCurrentUser,
        })}
      >
        <div className="flex justify-between">
          {isDelete ? (
            "(삭제된 메시지)"
          ) : isEditing ? (
            <fetcher.Form
              method="post"
              action={`/classes/messages/${messageId}/update`}
            >
              <Input
                name="updatedContent"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex items-center gap-1 mt-3">
                <Button>저장</Button>
                <Button type="button" onClick={() => setIsEditing(false)}>
                  취소
                </Button>
              </div>
            </fetcher.Form>
          ) : (
            <p>
              {isEdited ? <span>(수정됨)</span> : null} {content}
            </p>
          )}
          {senderId === userId ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="text-gray-400" />
              </DropdownMenuTrigger>
              {isDelete ? (
                <DropdownMenuContent className="flex justify-center items-center py-3">
                  <fetcher.Form
                    method="post"
                    action={`/classes/messages/${messageId}/restore`}
                  >
                    {" "}
                    <Button>복구하기</Button>
                  </fetcher.Form>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent className="flex flex-col gap-3 p-3 items-center">
                  <Button type="button" onClick={handleEditClick}>
                    수정하기
                  </Button>

                  <fetcher.Form
                    method="post"
                    action={`/classes/messages/${messageId}/delete`}
                  >
                    <Button>삭제하기</Button>
                  </fetcher.Form>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          ) : null}
        </div>
      </div>
      {isCurrentUser && (
        <span className="text-sm text-gray-400">
          {isRead
            ? `${DateTime.fromISO(readAt)
                .toLocal()
                .setLocale("ko")
                .toRelative()}에 읽음`
            : "안읽음"}
        </span>
      )}
    </div>
  );
}
