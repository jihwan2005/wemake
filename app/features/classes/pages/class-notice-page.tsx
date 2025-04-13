import { Button } from "~/common/components/ui/button";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-notice-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { getAuthorIdByClassId } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = Number(params.classId);
  const author = await getAuthorIdByClassId(client, {
    classId,
  });
  const instructor = userId === author.author_id;
  return { instructor };
};

export default function ClassNoticePage({ loaderData }: Route.ComponentProps) {
  return (
    <div>{loaderData.instructor ? <Button>공지사항 올리기</Button> : null}</div>
  );
}
