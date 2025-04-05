import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/upvote-video-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { toggleVideoUpvote } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await toggleVideoUpvote(client, {
    videoId: params.videoId,
    userId,
  });
  return {
    ok: true,
  };
};
