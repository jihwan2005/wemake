import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/social-start-page";
import { z } from "zod";
import { redirect } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Social Login - ProductHunt Clone" }];
};

const paramsSchema = z.object({
  provider: z.enum(["github", "kakao", "google"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/auth/login");
  }
  const { provider } = data;
  const redirectTo = `http://localhost:5173/auth/social/${provider}/complete`;
  const { client, headers } = makeSSRClient(request);
  const {
    data: { url },
    error,
  } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });
  if (url) {
    return redirect(url, { headers });
  }
  if (error) {
    throw error;
  }
};
