import { Outlet, useOutletContext } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
} from "~/common/components/ui/sidebar";
import { makeSSRClient, browserClient, type Database } from "~/supa-client";
import type { Route } from "./+types/class-messages-layout";
import { getClassMessages } from "../data/queries";
import { getLoggedInUserId } from "~/features/users/queries";
import ClassMessageRoomCard from "../pages/components/message/class-message-room-card";
import { useEffect, useState } from "react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const messages = await getClassMessages(client, { userId });
  return {
    messages,
  };
};

export default function ClassMessagesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { userId, name, avatar } = useOutletContext<{
    userId: string;
    name: string;
    avatar: string;
  }>();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState(loaderData.messages);
  const pinnedMessages = messages.filter((msg) => msg.is_pinned);
  const unpinnedMessages = messages.filter((msg) => !msg.is_pinned);
  useEffect(() => {
    const channel = browserClient.channel("online-users", {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();

      const userIds = Object.keys(state);
      setOnlineUsers(userIds);
    });
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({});
      }
    });
    return () => {
      channel.unsubscribe();
    };
  }, [userId]);
  useEffect(() => {
    const channel = browserClient.channel("messages-watch");

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "class_message",
          filter: "is_read=eq.false",
        },
        (payload) => {
          const newMessage = payload.new;
          if (newMessage.sender !== userId) {
            setMessages((prev) => {
              const updated = prev.map((msg) =>
                msg.class_message_room_id === newMessage.class_message_room_id
                  ? {
                      ...msg,
                      unread_count: msg.unread_count + 1,
                      last_message: newMessage.message_content,
                      last_message_created_at: newMessage.created_at,
                    }
                  : msg
              );

              return updated.sort((a, b) => {
                if (b.unread_count !== a.unread_count) {
                  return b.unread_count - a.unread_count;
                }
                return (
                  new Date(b.last_message_created_at).getTime() -
                  new Date(a.last_message_created_at).getTime()
                );
              });
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);
  useEffect(() => {
    const channel = browserClient.channel("messages-pin-watch");

    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "class_message_room_members",
        },
        (payload) => {
          const updated =
            payload.new as Database["public"]["Tables"]["class_message_room_members"]["Row"];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.class_message_room_id === updated.class_message_room_id &&
              msg.profile_id === updated.profile_id
                ? {
                    ...msg,
                    is_pinned: updated.is_pinned,
                  }
                : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);
  return (
    <SidebarProvider className="flex max-h-[calc(100vh-14rem)] overflow-hidden h-[calc(100vh-14rem)] min-h-full">
      <Sidebar className="pt-16" variant="floating">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>즐겨 찾는 방</SidebarGroupLabel>
            <SidebarMenu>
              {pinnedMessages.map((message) => (
                <ClassMessageRoomCard
                  key={message.class_message_room_id}
                  id={message.class_message_room_id.toString()}
                  name={message.name}
                  lastMessage={message.last_message}
                  lastmessageCreatedAt={message.last_message_created_at}
                  avatarUrl={message.avatar ?? ""}
                  isOnline={onlineUsers.includes(message.other_profile_id)}
                  isPinned={message.is_pinned}
                  unReadCount={message.unread_count}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>나머지 방</SidebarGroupLabel>
            <SidebarMenu>
              {unpinnedMessages.map((message) => (
                <ClassMessageRoomCard
                  key={message.class_message_room_id}
                  id={message.class_message_room_id.toString()}
                  name={message.name}
                  lastMessage={message.last_message}
                  lastmessageCreatedAt={message.last_message_created_at}
                  avatarUrl={message.avatar ?? ""}
                  isOnline={onlineUsers.includes(message.other_profile_id)}
                  isPinned={message.is_pinned}
                  unReadCount={message.unread_count}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className=" h-full flex-1">
        <Outlet
          context={{
            userId,
            name,
            avatar,
            updateSidebarMessages: setMessages,
            username: messages.map((msg) => ({
              roomId: msg.class_message_room_id,
              username: msg.name,
            })),
          }}
        />
      </div>
    </SidebarProvider>
  );
}
