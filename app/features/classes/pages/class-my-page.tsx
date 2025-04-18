import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-my-page";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  getChapterWithLessons,
  getMyClasses,
  getMyMakingClasses,
} from "../queries";
import { Hero } from "~/common/components/hero";
import MyEnrollingClass from "./components/my-enrolling-class";
import MyMakingClass from "./components/my-making-class";
import { calculateProgress } from "../utils/progress";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const myClasses = await getMyClasses(client, {
    userId,
  });
  const myMakeClasses = await getMyMakingClasses(client, {
    userId,
  });
  const classesWithProgress = await Promise.all(
    myClasses.map(async (cls) => {
      const chapterWithLesson = await getChapterWithLessons(client, {
        classId: cls.class_post_id,
      });
      const grouped = chapterWithLesson.reduce(
        (acc, item) => {
          const existing = acc.find((g) => g.chapter_id === item.chapter_id);
          const lesson = {
            lesson_id: item.lesson_id!,
            title: item.lesson_title,
            is_completed: item.is_completed,
          };
          if (existing) {
            existing.class_chapter_lesson.push(lesson);
          } else {
            acc.push({
              chapter_id: item.chapter_id!,
              title: item.chapter_title,
              class_post_id: item.class_post_id!,
              class_chapter_lesson: [lesson],
            });
          }
          return acc;
        },
        [] as {
          chapter_id: string;
          title: string | null;
          class_post_id: number;
          class_chapter_lesson: {
            lesson_id: string;
            title: string | null;
            is_completed: boolean | null;
          }[];
        }[]
      );
      const progress = calculateProgress(grouped);
      return { ...cls, progress };
    })
  );
  return { myMakeClasses, classesWithProgress };
};

export default function MyClassPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title=" My Class"
        subtitle="No limit on you. Just creativity matters"
      />
      <span className="text-3xl">내가 등록한 강의</span>
      <MyEnrollingClass classes={loaderData.classesWithProgress} />

      <span className="text-3xl">내가 만든 강의</span>
      <MyMakingClass classes={loaderData.myMakeClasses} />
    </div>
  );
}
