import { browserClient } from "~/supa-client";

export async function markMessagesAsRead(roomId: string, userId: string) {
  const { error } = await browserClient
    .from("class_message")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("class_message_room_id", Number(roomId))
    .eq("is_read", false)
    .neq("sender", userId);

  if (error) throw error;
}
