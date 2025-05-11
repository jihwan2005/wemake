import { makeSSRClient } from "~/supa-client";

import { getLoggedInUserId } from "~/features/users/queries";
import {
  getCertificateByUserId,
  getChapterWithLessons,
  getMyClasses,
  getMyMakingClasses,
} from "../../data/queries";
import { Hero } from "~/common/components/hero";
import MyEnrollingClass from "../components/my/my-enrolling-class";
import MyMakingClass from "../components/my/my-making-class";
import { calculateProgress } from "../../utils/progress";
import MyInventoryDialog from "../components/my/my-inventory-dialog";
import type { Route } from "./+types/class-my-page";

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
          const existing = acc.find(
            (g: any) => g.chapter_id === item.chapter_id
          );
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
  const myCertificates = await getCertificateByUserId(client, {
    userId,
  });
  return { myMakeClasses, classesWithProgress, myCertificates };
};

export default function MyClassPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title=" My Class"
        subtitle="No limit on you. Just creativity matters"
      />
      <MyInventoryDialog certificates={loaderData.myCertificates} />
      <div className="flex flex-col gap-3">
        <span className="text-3xl">내가 등록한 강의</span>
        <MyEnrollingClass classes={loaderData.classesWithProgress} />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-3xl">내가 만든 강의</span>
        <MyMakingClass classes={loaderData.myMakeClasses} />
      </div>
    </div>
  );
}
