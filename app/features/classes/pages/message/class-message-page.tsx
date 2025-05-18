import { useOutletContext } from "react-router";

import { makeSSRClient } from "~/supa-client";
import { useEffect, useRef, useState } from "react";
import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/class-message-page";
import {
  getClassMessageRoomNotification,
  getClassMessagesByClassMessagesRoomId,
  getClassRoomsParticipant,
  sendClassMessageToRoom,
} from "~/features/classes/data/queries";
import { createMessageImage } from "~/features/classes/data/mutations";
import { useMessageHandler } from "~/features/classes/hooks/useMessageHandler";
import ClassMessageHeader from "../components/message/ClassMessageHeader";
import ClassMessageNotification from "../components/message/ClassMessageNotification";
import ClassMessageSearch from "../components/message/ClassMessageSearch";
import ClassMessageBody from "../components/message/ClassMessageBody";
import ClassMessageFooter from "../components/message/ClassMessageFooter";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Message | wemake" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classMessageRoomId = params.classMessageRoomId;
  const messages = await getClassMessagesByClassMessagesRoomId(client, {
    messageRoomId: params.classMessageRoomId,
    userId,
  });
  const participant = await getClassRoomsParticipant(client, {
    messageRoomId: params.classMessageRoomId,
    userId,
  });
  const notifications = await getClassMessageRoomNotification(client, {
    roomId: params.classMessageRoomId,
  });
  return {
    messages,
    participant,
    classMessageRoomId,
    notifications,
  };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const message = formData.get("message");
  const isRead = formData.get("is_read") === "true";
  const messageImages = formData.getAll("images") as File[];
  const classMessageId = await sendClassMessageToRoom(client, {
    messageRoomId: params.classMessageRoomId,
    message: message as string,
    userId,
    isRead,
  });
  const uploadResults = await Promise.all(
    messageImages.map(async (showcaseImage) => {
      const filePath = `${userId}/${Date.now()}`;
      const { error } = await client.storage
        .from("message-image")
        .upload(filePath, showcaseImage, {
          contentType: showcaseImage.type,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = client.storage.from("message-image").getPublicUrl(filePath);

      return publicUrl;
    })
  );

  await Promise.all(
    uploadResults.map((messageImageUrl) =>
      createMessageImage(client, {
        roomId: params.classMessageRoomId,
        messageImageUrl,
        messageId: classMessageId,
      })
    )
  );
  return {
    ok: true,
  };
};

export default function MessagePage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(loaderData.messages);
  const { userId, name, avatar, updateSidebarMessages } = useOutletContext<{
    userId: string;
    name: string;
    avatar: string;
    updateSidebarMessages: React.Dispatch<React.SetStateAction<any[]>>;
  }>();
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const { isTyping, payload, sendTypingEvent } = useMessageHandler({
    userId,
    classMessageRoomId: loaderData.classMessageRoomId,
    loaderData,
    setMessages,
    setOnlineUsers,
    onlineUsers,
    updateSidebarMessages,
  });
  const [searchText, setSearchText] = useState("");
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const scrollToMessage = (messageId: number) => {
    const target = messageRefs.current[messageId];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const searchAndScroll = () => {
    const found = messages.find((msg) =>
      msg.message_content.includes(searchText)
    );
    if (found) {
      scrollToMessage(found.class_message_id);
    } else {
      alert("메시지를 찾을 수 없습니다.");
    }
  };

  const handleTypingChange = () => {
    sendTypingEvent();
  };

  useEffect(() => {
    if (actionData?.ok) {
      formRef.current?.reset();
      setNewMessage("");
    }
  }, [actionData]);

  useEffect(() => {
    setMessages(loaderData.messages);
  }, [loaderData.messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col justify-between w-full">
      <ClassMessageHeader
        avatarUrl={loaderData.participant?.profile?.avatar ?? ""}
        avatarFallback={loaderData.participant?.profile?.name.charAt(0) ?? ""}
        name={loaderData.participant?.profile?.name ?? ""}
        createdAt={
          loaderData.messages.length > 0
            ? loaderData.messages[loaderData.messages.length - 1].created_at
            : ""
        }
        messagesCount={loaderData.messages.length}
      />
      <div className="flex items-center">
        <ClassMessageNotification notifications={loaderData.notifications} />

        <ClassMessageSearch
          searchText={searchText}
          setSearchText={setSearchText}
          searchAndScroll={searchAndScroll}
        />
      </div>

      <ClassMessageBody
        messages={messages}
        userId={userId}
        avatar={avatar}
        name={name}
        participantAvatar={loaderData.participant?.profile?.avatar ?? ""}
        participantName={loaderData.participant?.profile?.name ?? ""}
        isTyping={isTyping}
        typingUserId={payload?.userId ?? null}
        messagesEndRef={messagesEndRef}
        searchText={searchText}
        messageRefs={messageRefs}
        onlineUsers={onlineUsers}
      />
      <ClassMessageFooter
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleTypingChange={handleTypingChange}
        onlineUsers={onlineUsers}
        roomId={loaderData.classMessageRoomId}
      />
    </div>
  );
}
