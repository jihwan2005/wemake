import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/logout-page";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  await client.auth.signOut();
  return redirect("/", { headers });
};
