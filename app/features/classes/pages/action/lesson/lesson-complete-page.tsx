import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";

import type { Route } from "./+types/lesson-bookmark-page";
import { toggleComplete } from "~/features/classes/data/mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const lessonId = params.lessonId;
  const userId = await getLoggedInUserId(client);
  await toggleComplete(client, {
    lessonId: lessonId,
    userId,
  });
  return {
    ok: true,
  };
};
