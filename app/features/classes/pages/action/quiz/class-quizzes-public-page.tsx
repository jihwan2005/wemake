import { makeSSRClient } from "~/supa-client";

import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/class-quizzes-public-page";
import { updateClassQuizPublic } from "~/features/classes/data/mutations";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const quizId = formData.get("quizId") as string;

  await updateClassQuizPublic(client, {
    quizId,
    userId,
  });
  return {
    ok: true,
  };
};
