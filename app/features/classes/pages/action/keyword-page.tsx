import { makeSSRClient } from "~/supa-client";

import type { Route } from "./+types/class-review-page";
import { createKeyword } from "../../mutations";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const keyword = formData.get("keyword") as string;
  await createKeyword(client, {
    keyword,
  });
  return {
    ok: true,
  };
};
