import { ClassMessageBubble } from "./class-message-bubble";
import { DateTime } from "luxon";
import React, { useRef } from "react";
import ClassMessageDate from "./ClassMessageDate";
import ClassMessageImage from "./ClassMessageImage";
import type { ClassMessageBodyProps } from "../../types/class-types";

const ClassMessageBody: React.FC<ClassMessageBodyProps> = ({
  messages,
  userId,
  avatar,
  name,
  participantAvatar,
  participantName,
  isTyping,
  typingUserId,
  messagesEndRef,
  messageRefs,
  searchText,
}) => {
  let lastDate = "";
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  return (
    <div className="py-10 overflow-y-scroll flex flex-col justify-start h-full space-y-4">
      {messages.map((message) => {
        const date = DateTime.fromISO(message.read_at).setLocale("ko");
        const currentDate = date.toFormat("yyyy년 M월 d일 cccc"); // 날짜 포맷 예: 2025년 5월 3일 토요일

        const showDate = currentDate !== lastDate;
        lastDate = currentDate;

        return (
          <React.Fragment key={message.class_message_id}>
            {showDate && (
              <ClassMessageDate
                date={currentDate}
                rawDate={message.read_at}
                messages={messages}
                dateRefs={dateRefs}
              />
            )}
            <div
              ref={(el) => {
                messageRefs.current[message.class_message_id] = el;
              }}
            >
              {message.message_content.trim() && (
                <ClassMessageBubble
                  avatarUrl={
                    message.sender === userId ? avatar : participantAvatar
                  }
                  avatarFallback={
                    message.sender === userId
                      ? name.charAt(0)
                      : participantName.charAt(0)
                  }
                  content={message.message_content}
                  isCurrentUser={message.sender === userId}
                  isRead={message.is_read}
                  isDelete={message.is_delete}
                  isEdited={message.is_edited}
                  readAt={message.read_at}
                  senderId={message.sender}
                  messageId={message.class_message_id}
                  searchText={searchText}
                />
              )}
              {message.class_message_images &&
                message.class_message_images.length > 0 && (
                  <ClassMessageImage
                    images={message.class_message_images}
                    isCurrentUser={message.sender === userId}
                  />
                )}
            </div>
          </React.Fragment>
        );
      })}
      {isTyping && typingUserId !== userId && (
        <div className="text-sm text-muted-foreground px-4">
          {participantName || "상대"}님이 입력 중...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ClassMessageBody;
