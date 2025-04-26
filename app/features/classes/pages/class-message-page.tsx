import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Form, useOutletContext } from "react-router";
import { Textarea } from "~/common/components/ui/textarea";
import { Button } from "~/common/components/ui/button";
import { SendIcon } from "lucide-react";
import {
  getClassMessagesByClassMessagesRoomId,
  getClassRoomsParticipant,
  sendClassMessageToRoom,
} from "../queries";
import { browserClient, makeSSRClient } from "~/supa-client";
import { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import type { Database } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/class-message-page";
import { ClassMessageBubble } from "./components/class-message-bubble";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Message | wemake" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const messages = await getClassMessagesByClassMessagesRoomId(client, {
    messageRoomId: params.classMessageRoomId,
    userId,
  });
  const participant = await getClassRoomsParticipant(client, {
    messageRoomId: params.classMessageRoomId,
    userId,
  });
  return {
    messages,
    participant,
  };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const formData = await request.formData();
  const message = formData.get("message");
  await sendClassMessageToRoom(client, {
    messageRoomId: params.classMessageRoomId,
    message: message as string,
    userId,
    classId,
  });
  return {
    ok: true,
  };
};

export default function MessagePage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [messages, setMessages] = useState(loaderData.messages);
  const { userId, name, avatar } = useOutletContext<{
    userId: string;
    name: string;
    avatar: string;
  }>();
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (actionData?.ok) {
      formRef.current?.reset();
    }
  }, [actionData]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    const changes = browserClient
      .channel(`room:${userId}-${loaderData.participant?.profile?.profile_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) => [
            ...prev,
            payload.new as Database["public"]["Tables"]["class_message"]["Row"],
          ]);
        }
      )
      .subscribe();
    return () => {
      changes.unsubscribe();
    };
  }, []);
  return (
    <div className="h-full flex flex-col justify-between">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage src={loaderData.participant?.profile?.avatar ?? ""} />
            <AvatarFallback>
              {loaderData.participant?.profile?.name.charAt(0) ?? ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <CardTitle className="text-xl">
              {loaderData.participant?.profile?.name ?? ""}
            </CardTitle>
            <CardDescription>
              {loaderData.messages.length > 0
                ? DateTime.fromISO(
                    loaderData.messages[loaderData.messages.length - 1]
                      .created_at,
                    { zone: "utc" }
                  )
                    .toLocal()
                    .setLocale("ko")
                    .toRelative()
                : "No messages"}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      <div className="py-10 overflow-y-scroll flex flex-col justify-start h-full space-y-4">
        {messages.map((message) => (
          <ClassMessageBubble
            key={message.class_message_id}
            avatarUrl={
              message.sender === userId
                ? avatar
                : loaderData.participant?.profile?.avatar ?? ""
            }
            avatarFallback={
              message.sender === userId
                ? name.charAt(0)
                : loaderData.participant?.profile.name.charAt(0) ?? ""
            }
            content={message.message_content}
            isCurrentUser={message.sender === userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Card>
        <CardHeader>
          <Form
            className="relative flex justify-end items-center"
            method="post"
          >
            <Textarea
              placeholder="Write a message..."
              rows={2}
              className="resize-none"
              name="message"
            />
            <Button type="submit" size="icon" className="absolute right-2">
              <SendIcon className="size-4" />
            </Button>
          </Form>
        </CardHeader>
      </Card>
    </div>
  );
}
