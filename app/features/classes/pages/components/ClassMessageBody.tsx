import { ClassMessageBubble } from "./class-message-bubble";

interface Message {
  class_message_id: number;
  sender: string;
  message_content: string;
  is_read: boolean;
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
}) => {
  return (
    <div className="py-10 overflow-y-scroll flex flex-col justify-start h-full space-y-4">
      {messages.map((message) => (
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
          readAt={message.read_at}
        />
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
