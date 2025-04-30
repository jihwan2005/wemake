import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-message-update-page";
import { updateClassMessage } from "../../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const messageId = params.classMessageRoomId;
  const formData = await request.formData();
  const messageContent = formData.get("updatedContent") as string;
  await updateClassMessage(client, {
    messageId,
    messageContent,
  });
  return {
    ok: true,
  };
};
