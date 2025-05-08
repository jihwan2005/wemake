import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-delete-page";
import { deleteClassQuestion } from "~/features/classes/data/mutations";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const questionId = formData.get("questionId") as string;

  await deleteClassQuestion(client, {
    questionId,
  });
  return {
    ok: true,
  };
};
