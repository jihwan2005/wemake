import { makeSSRClient } from "~/supa-client";
import { deleteReview } from "../../mutations";
import type { Route } from "./+types/class-review-delete-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const reviewId = formData.get("reviewId") as string;
  await deleteReview(client, {
    reviewId,
  });
  return {
    ok: true,
  };
};
