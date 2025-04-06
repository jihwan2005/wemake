import { makeSSRClient } from "~/supa-client";

import { upadateReply } from "../mutations";
import type { Route } from "./+types/delete-video-page";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const replyId = formData.get("reply_id") as string;
  const reply = formData.get("reply") as string;
  await upadateReply(client, {
    replyId,
    reply,
  });
  return Response.json({ ok: true });
};
