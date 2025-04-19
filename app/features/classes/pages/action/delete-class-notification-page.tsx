import { makeSSRClient } from "~/supa-client";
import { deleteClassNotification, seeClassNotification } from "../../mutations";
import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/delete-class-notification-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const { notificationId } = params;
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await deleteClassNotification(client, { userId, notificationId });
  return {
    ok: true,
  };
};
