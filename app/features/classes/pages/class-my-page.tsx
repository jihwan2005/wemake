import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-my-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { getMyClasses, getMyMakingClasses } from "../queries";
import { Hero } from "~/common/components/hero";
import MyEnrollingClass from "./components/my-enrolling-class";
import MyMakingClass from "./components/my-making-class";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const myClasses = await getMyClasses(client, {
    userId,
  });
  const myMakeClasses = await getMyMakingClasses(client, {
    userId,
  });
  return { myClasses, myMakeClasses };
};

export default function MyClassPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title=" My Class"
        subtitle="No limit on you. Just creativity matters"
      />
      <span className="text-3xl">내가 등록한 강의</span>
      <MyEnrollingClass classes={loaderData.myClasses} />

      <span className="text-3xl">내가 만든 강의</span>
      <MyMakingClass classes={loaderData.myMakeClasses} />
    </div>
  );
}
