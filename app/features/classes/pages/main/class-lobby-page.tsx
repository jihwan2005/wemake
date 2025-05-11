import { Hero } from "~/common/components/hero";

import { makeSSRClient } from "~/supa-client";
import { getClassById } from "../../data/queries";
import type { Route } from "./+types/class-lobby-page";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const cls = await getClassById(client, {
    classId: params.classId,
  });
  return {
    cls,
  };
};
export default function ClassLobbyPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title={`${loaderData.cls.title}`}
        subtitle={
          <>
            <p className="mt-3">{`Welcome to the ${loaderData.cls.title} lobby.`}</p>
            <p>{`Take a look at our class information and feel free to register if it interests you!`}</p>
          </>
        }
      />
    </div>
  );
}
