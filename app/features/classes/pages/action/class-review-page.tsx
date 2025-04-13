import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import { createReview } from "../../mutations";
import type { Route } from "./+types/class-review-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const review = formData.get("review") as string;
  await createReview(client, {
    classId: Number(params.classId),
    userId,
    review,
  });
  return {
    ok: true,
  };
};
