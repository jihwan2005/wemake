import { Link, useFetcher, useLocation } from "react-router";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/common/components/ui/avatar";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/common/components/ui/sidebar";
import { DateTime } from "luxon";
import { Star } from "lucide-react";
import { Button } from "~/common/components/ui/button";

interface MessageCardProps {
  id: string;
  avatarUrl?: string;
  name: string;
  lastMessage: string;
  isOnline: boolean;
  isPinned: boolean;
  lastmessageCreatedAt: string;
  unReadCount: number;
}

export default function ClassMessageRoomCard({
  id,
  avatarUrl,
  name,
  lastMessage,
  isOnline,
  lastmessageCreatedAt,
  unReadCount,
  isPinned,
}: MessageCardProps) {
  const location = useLocation();
  const fetcher = useFetcher();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-18 relative"
        asChild
        isActive={location.pathname === `/classes/messages/${id}`}
      >
        <Link to={`/classes/messages/${id}`}>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm">{name}</span>
              <span className="text-xs text-muted-foreground">
                {lastMessage}
              </span>
              <span className="text-xs text-gray-400">
                {DateTime.fromISO(lastmessageCreatedAt).toRelative()}
              </span>
            </div>
          </div>
          <fetcher.Form
            method="post"
            action={`/classes/messages/${id}/pin`}
            onClick={(e) => e.stopPropagation()} // 클릭 전파 방지
            className="absolute top-1 right-1"
          >
            <input type="hidden" name="roomId" value={id} />
            <Button variant="ghost" size="icon">
              <Star
                className="size-4"
                fill={isPinned ? "#facc15" : "none"} // 노란색 채움 (Tailwind의 yellow-400)
                stroke={isPinned ? "#facc15" : "currentColor"} // 선도 노란색으로
              />
            </Button>
          </fetcher.Form>
          {unReadCount > 0 && (
            <span className="rounded-full bg-orange-600 text-white w-5 h-5 text-center right-0 absolute">
              {unReadCount}
            </span>
          )}
          <span
            className="absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: isOnline ? "#22c55e" : "#ef4444" }}
          />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
