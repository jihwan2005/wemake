// ClassMessageBubbleTime.tsx
import { DateTime } from "luxon";

interface ClassMessageBubbleTimeProps {
  isRead: boolean;
  readAt: string;
}

export function ClassMessageBubbleTime({
  isRead,
  readAt,
}: ClassMessageBubbleTimeProps) {
  return (
    <span className="text-sm text-gray-400">
      {isRead
        ? `${DateTime.fromISO(readAt)
            .toLocal()
            .setLocale("ko")
            .toRelative()}에 읽음`
        : "안읽음"}
    </span>
  );
}
