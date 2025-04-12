import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/lesson-page";
import { getLessonById } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const lessonId = params.lessonId;
  const lesson = await getLessonById(client, {
    lessonId,
  });
  if (!lesson) {
    throw new Response("Lesson not found", { status: 404 });
  }
  return { lesson };
};

export default function LessonPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      {loaderData.lesson.video_url && (
        <video className="w-full">
          <source src={loaderData.lesson.video_url} type="video/mp4" />
        </video>
      )}
      <span>{loaderData.lesson.title}</span>
    </div>
  );
}
