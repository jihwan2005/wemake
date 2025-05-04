import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-message-deliver-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { sendClassMessageToRoom } from "../../queries";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const messageContent = formData.get("content") as string;

  const roomAndIsReadList = formData.getAll("roomAndIsRead") as string[];

  await Promise.all(
    roomAndIsReadList.map((entry) => {
      const [roomId, isReadStr] = entry.split(":");
      const isRead = isReadStr === "true";

      return sendClassMessageToRoom(client, {
        messageRoomId: roomId,
        message: messageContent,
        userId,
        isRead,
      });
    })
  );
  return {
    ok: true,
  };
};
