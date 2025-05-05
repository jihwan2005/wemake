import { makeSSRClient } from "~/supa-client";
import { pinclassMessageRooms } from "../../../data/mutations";

import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/class-message-pin-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const roomId = params.classMessageRoomId;
  await pinclassMessageRooms(client, {
    roomId,
    userId,
  });
  return {
    ok: true,
  };
};
