import { useEffect } from "react";
import { Link, useLocation, useOutletContext } from "react-router";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/common/components/ui/avatar";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/common/components/ui/sidebar";
import { markMessagesAsRead } from "../../functions/markMessagesAsRead";
import { DateTime } from "luxon";

interface MessageCardProps {
  id: string;
  avatarUrl?: string;
  name: string;
  lastMessage: string;
  isOnline: boolean;
  lastmessageCreatedAt: string;
}

export default function ClassMessageRoomCard({
  id,
  avatarUrl,
  name,
  lastMessage,
  isOnline,
  lastmessageCreatedAt,
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
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {DateTime.fromISO(lastmessageCreatedAt).toFormat("yyyy-MM-dd")}
          </span>
          {isOnline && (
            <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
