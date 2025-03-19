import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/see-notification-page";
import { getLoggedInUserId } from "../queries";
import { seeNotification } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const { notificationId } = params;
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await seeNotification(client, { userId, notificationId });
  return {
    ok: true,
  };
};
