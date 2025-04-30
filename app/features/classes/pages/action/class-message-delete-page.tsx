import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-message-delete-page";
import { deleteClassMessage } from "../../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const messageId = params.classMessageRoomId;
  await deleteClassMessage(client, {
    messageId,
  });
  return {
    ok: true,
  };
};
