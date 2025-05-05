import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/lesson-page";
import {
  getChapterTitleByLessonId,
  getChapterWithLessons,
  getClassById,
  getCourseList,
  getLessonById,
} from "../data/queries";
import { SidebarInset, SidebarProvider } from "~/common/components/ui/sidebar";
import LessonSidebar from "./components/course-sidebar";
import { useFetcher } from "react-router";
import Header from "./components/my/header";
import { calculateProgress } from "../utils/progress";
import { getLoggedInUserId } from "~/features/users/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = Number(params.classId);
  const lessonId = params.lessonId;
  const lesson = await getLessonById(client, {
    lessonId,
  });
  const classTitle = await getClassById(client, {
    classId: String(classId),
  });
  if (!lesson) {
    throw new Response("Lesson not found", { status: 404 });
  }
  const course = await getCourseList(client, {
    classId,
  });
  const chapterTitle = await getChapterTitleByLessonId(client, {
    lessonId,
  });
  const chapterWithLesson = await getChapterWithLessons(client, {
    classId,
  });
  const grouped = chapterWithLesson.reduce(
    (acc, item) => {
      const existing = acc.find((g: any) => g.chapter_id === item.chapter_id);
      const lesson = {
        lesson_id: item.lesson_id!,
        title: item.lesson_title,
        is_completed: item.is_completed,
        is_hidden: item.is_hidden ?? undefined,
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
        is_hidden?: boolean;
      }[];
    }[]
  );
  const progress = calculateProgress(grouped);
  return {
    lesson,
    userId,
    course: grouped,
    classTitle,
    chapterTitle,
    classId,
    lessonId,
    chapterWithLesson,
    progress,
  };
};

export default function LessonPage({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const absordclick = () => {
    fetcher.submit(null, {
      method: "POST",
      action: `/classes/${loaderData.classId}/${loaderData.lessonId}/bookmark`,
    });
  };
  const complete = () => {
    fetcher.submit(null, {
      method: "POST",
      action: `/classes/${loaderData.classId}/${loaderData.lessonId}/complete`,
    });
  };
  return (
    <SidebarProvider defaultOpen={false}>
      <LessonSidebar
        course={loaderData.course}
        classTitle={loaderData.classTitle.title}
        author={loaderData.classTitle.author_id}
        userId={loaderData.userId}
        progress={loaderData.progress}
      />
      <SidebarInset>
        <Header
          classId={loaderData.classId}
          classTitle={loaderData.classTitle.title}
          chapterTitle={loaderData.chapterTitle.title}
          lessonTitle={loaderData.lesson.title}
          IsBookmarked={loaderData.lesson.is_bookmarked}
          IsCompleted={loaderData.lesson.is_completed}
          onBookmarkClick={absordclick}
          onCompleteClick={complete}
        />
        <div className="bg-amber-300 w-full h-full">
          {loaderData.lesson.title}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
