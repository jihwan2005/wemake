import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import { toggleBookMark } from "../../mutations";
import type { Route } from "./+types/lesson-bookmark-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const lessonId = params.lessonId;
  const userId = await getLoggedInUserId(client);
  await toggleBookMark(client, {
    lessonId: lessonId,
    userId,
  });
  return {
    ok: true,
  };
};
