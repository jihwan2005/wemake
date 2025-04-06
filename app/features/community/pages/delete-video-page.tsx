import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";

import { deleteReply } from "../mutations";
import type { Route } from "./+types/delete-video-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const replyId = formData.get("reply_id") as string;
  await deleteReply(client, {
    replyId,
  });
  return Response.json({ ok: true });
};
