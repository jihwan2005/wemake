import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/reply-video-page";
import { createVideoReply } from "../mutations";
import { json } from "@remix-run/node";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const reply = formData.get("reply") as string;
  await createVideoReply(client, {
    videoId: params.videoId,
    reply,
    userId,
  });
  return {
    ok: true,
  };
};
