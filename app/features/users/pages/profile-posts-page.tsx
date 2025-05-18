import type { Route } from "./+types/profile-posts-page";
import { getUserPosts } from "../queries";
import { makeSSRClient } from "~/supa-client";
export const meta: Route.MetaFunction = () => {
  return [{ title: "Posts | wemake" }];
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const { client } = makeSSRClient(request);
  const posts = await getUserPosts(client, { username: params.username });
  return { posts };
}

export default function ProfilePostsPage({ loaderData }: Route.ComponentProps) {
  return <div className="flex flex-col gap-5">hi</div>;
}
