import { ClassMessageBubble } from "./class-message-bubble";

interface Message {
  class_message_id: number;
  sender: string;
  message_content: string;
  is_read: boolean;
  is_delete: boolean;
  is_edited: boolean;
  read_at: string;
}

interface ClassMessageBodyProps {
  messages: Message[];
  userId: string;
  avatar: string;
  name: string;
  participantAvatar: string;
  participantName: string;
  isTyping: boolean;
  typingUserId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messageRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  searchText: string;
}

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
  return (
    <div className="py-10 overflow-y-scroll flex flex-col justify-start h-full space-y-4">
      {messages.map((message) => (
        <div
          key={message.class_message_id}
          ref={(el) => {
            messageRefs.current[message.class_message_id] = el;
          }}
        >
          <ClassMessageBubble
            key={message.class_message_id}
            avatarUrl={message.sender === userId ? avatar : participantAvatar}
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
        </div>
      ))}
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
