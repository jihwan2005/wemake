import { sendClassMessage } from "~/features/classes/data/mutations";
import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "../+types/class-send-message-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const studentIdsString = formData.get("studentIds") as string;
  const studentIds = studentIdsString?.split(",").filter(Boolean) ?? [];
  await Promise.all(
    studentIds.map((receiverId) =>
      sendClassMessage(client, {
        sender: userId,
        receiver: receiverId,
        message_content: message,
      })
    )
  );
  return {
    ok: true,
  };
};
