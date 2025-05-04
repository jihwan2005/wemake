import { useOutletContext } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";
import { ClassMessageBubbleDropdownMenu } from "./ClassMessageBubbleDropdownMenu";
import { ClassMessageBubbleContent } from "./ClassMessageBubbleContent";
import { useFetcher } from "react-router";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import type { MessageBubbleProps } from "../../types/class-types";
import { ClassMessageBubbleTime } from "./ClassMessageBubbleTime";

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
  searchText = "",
  onlineUsers,
}: MessageBubbleProps) {
  const { userId } = useOutletContext<{ userId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const fetcher = useFetcher();
  const [editedContent, setEditedContent] = useState("");
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(content);
  };
  useEffect(() => {
    if (fetcher.state === "idle" && isEditing) {
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
            <ClassMessageBubbleContent
              content={content}
              isEdited={isEdited}
              isDelete={isDelete}
              searchText={searchText}
            />
          )}
          {senderId === userId ? (
            <ClassMessageBubbleDropdownMenu
              isDelete={isDelete}
              messageId={messageId}
              onEditClick={handleEditClick}
              isEditing={isEditing}
              content={content}
              onlineUsers={onlineUsers}
            />
          ) : null}
        </div>
      </div>
      {isCurrentUser && (
        <ClassMessageBubbleTime isRead={isRead} readAt={readAt} />
      )}
    </div>
  );
}
