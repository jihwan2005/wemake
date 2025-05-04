import { Hero } from "~/common/components/hero";
import { getClassById } from "../queries";
import type { Route } from "./+types/class-quiz-page";
import { makeSSRClient } from "~/supa-client";
import { Upload } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { getLoggedInUserId } from "~/features/users/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const { title, author_id } = await getClassById(client, {
    classId: params.classId,
  });
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  return { title, author_id, classId, userId };
};

export default function ClassQuizPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="Quiz" subtitle={`${loaderData.title}`} />
      {loaderData.author_id === loaderData.userId ? (
        <Link to={`/classes/${loaderData.classId}/quiz/upload`}>
          <Button>
            <Upload className="size-4" />
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
