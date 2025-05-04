import { useEffect } from "react";
import { markMessagesAsRead } from "../functions/markMessagesAsRead";
import { browserClient } from "~/supa-client";
import type { Database } from "~/supa-client";
import { useTypingIndicator } from "../hooks/useTypingIndicator";

export const useMessageHandler = ({
  userId,
  classMessageRoomId,
  setMessages,
  setOnlineUsers,
  onlineUsers,
  updateSidebarMessages,
}: {
  userId: string;
  classMessageRoomId: string;
  loaderData: any;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setOnlineUsers: React.Dispatch<React.SetStateAction<number>>;
  updateSidebarMessages: React.Dispatch<React.SetStateAction<any[]>>;
  onlineUsers: number;
  setLastSeen?: (roomId: string, value: string) => void;
}) => {
  const { isTyping, sendTypingEvent, payload } = useTypingIndicator({
    roomId: classMessageRoomId,
    userId,
  });
  useEffect(() => {
    if (onlineUsers > 1) {
      markMessagesAsRead(classMessageRoomId, userId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender !== userId && !msg.is_read
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      );
      updateSidebarMessages((prev) =>
        prev.map((msg) =>
          msg.class_message_room_id === Number(classMessageRoomId)
            ? { ...msg, unread_count: 0 }
            : msg
        )
      );
    }
  }, [onlineUsers]);

  useEffect(() => {
    const channel = browserClient.channel(`room:${classMessageRoomId}`, {
      config: { presence: { key: userId } },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "class_message",
          filter: `class_message_room_id=eq.${classMessageRoomId}`,
        },
        (payload) => {
          const newMessage =
            payload.new as Database["public"]["Tables"]["class_message"]["Row"];
          const isFromOther = newMessage.sender !== userId;
          const isRead = onlineUsers > 1 && isFromOther;
          if (onlineUsers > 1) {
            updateSidebarMessages((prev) =>
              prev.map((msg) =>
                msg.class_message_room_id === Number(classMessageRoomId)
                  ? { ...msg, unread_count: 0 }
                  : msg
              )
            );
          }
          setMessages((prev) => [
            ...prev,
            {
              ...newMessage,
              is_read: isRead,
              read_at: new Date().toISOString(),
            },
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "class_message",
          filter: `class_message_room_id=eq.${classMessageRoomId}`,
        },
        (payload) => {
          const updated =
            payload.new as Database["public"]["Tables"]["class_message"]["Row"];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.class_message_id === updated.class_message_id
                ? {
                    ...msg,
                    is_delete: updated.is_delete,
                    is_read: updated.is_read,
                    is_edited: updated.is_edited,
                    read_at: updated.read_at,
                    message_content: updated.message_content,
                  }
                : msg
            )
          );
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const onlineUsers = Object.keys(state).length;
        if (onlineUsers > 1) {
          markMessagesAsRead(classMessageRoomId, userId);
        }
        setOnlineUsers(onlineUsers);
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "class_message_images",
          filter: `class_message_room_id=eq.${classMessageRoomId}`,
        },
        (payload) => {
          const newImage =
            payload.new as Database["public"]["Tables"]["class_message_images"]["Row"];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.class_message_id === newImage.class_message_id
                ? {
                    ...msg,
                    class_message_images: [
                      ...(msg.class_message_images ?? []),
                      newImage,
                    ],
                  }
                : msg
            )
          );
        }
      )
      .subscribe();

    channel.track({
      online_at: new Date().toISOString(),
      userId,
    });

    return () => {
      channel.unsubscribe();
    };
  }, [classMessageRoomId, userId]);

  return { isTyping, sendTypingEvent, payload };
};
