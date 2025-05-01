import { Link, useLocation } from "react-router";
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

interface MessageCardProps {
  id: string;
  avatarUrl?: string;
  name: string;
  lastMessage: string;
  isOnline: boolean;
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
}: MessageCardProps) {
  const location = useLocation();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-18"
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
          <Star
            className="size-3 right-1 absolute top-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("별 클릭됨!");
            }}
          />
          {unReadCount === 0 ? (
            ""
          ) : (
            <span className="rounded-full bg-orange-600 text-white w-5 h-5 text-center right-0 absolute">
              {unReadCount}
            </span>
          )}
          {isOnline ? (
            <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          ) : (
            <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
