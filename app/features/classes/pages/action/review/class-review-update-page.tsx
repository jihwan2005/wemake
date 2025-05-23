import { makeSSRClient } from "~/supa-client";

import type { Route } from "./+types/class-review-delete-page";
import { updateReview } from "~/features/classes/data/mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const reviewId = formData.get("reviewId") as string;
  const review = formData.get("review") as string;
  await updateReview(client, {
    reviewId,
    review,
  });
  return {
    ok: true,
  };
};
