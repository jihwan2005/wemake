import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import { toggleUpvote } from "../../mutations";
import type { Route } from "./+types/class-upvote-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await toggleUpvote(client, {
    classId: params.classId,
    userId,
  });
  return {
    ok: true,
  };
};
