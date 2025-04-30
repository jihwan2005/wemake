import { Outlet, useOutletContext } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarProvider,
} from "~/common/components/ui/sidebar";
import { makeSSRClient, browserClient } from "~/supa-client";
import type { Route } from "./+types/class-messages-layout";
import { getClassMessages } from "../queries";
import { getLoggedInUserId } from "~/features/users/queries";
import ClassMessageRoomCard from "../pages/components/class-message-room-card";
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

  return (
    <SidebarProvider className="flex max-h-[calc(100vh-14rem)] overflow-hidden h-[calc(100vh-14rem)] min-h-full">
      <Sidebar className="pt-16" variant="floating">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {loaderData.messages.map((message) => (
                <ClassMessageRoomCard
                  key={message.class_message_room_id}
                  id={message.class_message_room_id.toString()}
                  name={message.name}
                  lastMessage={message.last_message}
                  lastmessageCreatedAt={message.last_message_created_at}
                  avatarUrl={message.avatar ?? ""}
                  isOnline={onlineUsers.includes(message.other_profile_id)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className=" h-full flex-1">
        <Outlet context={{ userId, name, avatar }} />
      </div>
    </SidebarProvider>
  );
}
