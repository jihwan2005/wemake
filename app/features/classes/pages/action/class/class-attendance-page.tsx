import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";

import type { Route } from "./+types/class-attendance-page";
import { toggleAttendance } from "~/features/classes/data/mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const formData = await request.formData();
  const date = formData.get("date") as string;
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await toggleAttendance(client, {
    classId: params.classId,
    userId,
    date,
  });
  return {
    ok: true,
  };
};
