import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/vote-post-page";
import { toggleVote } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }

  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const optionIndex = formData.get("optionIndex");
  await toggleVote(client, {
    postId: params.postId,
    userId,
    optionIndex: Number(optionIndex),
  });
  return {
    ok: true,
  };
};
