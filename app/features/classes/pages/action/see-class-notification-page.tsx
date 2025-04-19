import { makeSSRClient } from "~/supa-client";
import { seeClassNotification } from "../../mutations";
import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/see-class-notification-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const { notificationId } = params;
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await seeClassNotification(client, { userId, notificationId });
  return {
    ok: true,
  };
};
