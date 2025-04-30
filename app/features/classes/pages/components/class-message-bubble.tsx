import { DateTime } from "luxon";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { cn } from "~/lib/utils";

interface MessageBubbleProps {
  avatarUrl: string;
  avatarFallback: string;
  content: string;
  isCurrentUser?: boolean;
  isRead: boolean;
  readAt: string;
}

export function ClassMessageBubble({
  avatarUrl,
  avatarFallback,
  content,
  isRead,
  isCurrentUser = false,
  readAt,
}: MessageBubbleProps) {
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
        <p>{content}</p>
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
