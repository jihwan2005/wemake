export interface MessageImage {
  message_image_id: number | null;
  image_url: string | null;
  created_at: string | null;
  class_message_id: number | null;
  class_message_room_id: number | null;
}

export interface Message {
  class_message_id: number;
  sender: string;
  message_content: string;
  is_read: boolean;
  is_delete: boolean;
  is_edited: boolean;
  read_at: string;
  class_message_images?: MessageImage[];
}

export interface ClassMessageBodyProps {
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

export interface MessageBubbleProps {
  avatarUrl: string;
  avatarFallback: string;
  content: string;
  isCurrentUser?: boolean;
  isRead: boolean;
  isDelete: boolean;
  isEdited: boolean;
  readAt: string;
  senderId: string;
  messageId: number;
  searchText?: string;
}
