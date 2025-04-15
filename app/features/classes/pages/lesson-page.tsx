import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/lesson-page";
import {
  getChapterTitleByLessonId,
  getClassById,
  getCourseList,
  getLessonById,
} from "../queries";
import { SidebarInset, SidebarProvider } from "~/common/components/ui/sidebar";
import LessonSidebar from "./components/course-sidebar";
import { useFetcher } from "react-router";
import Header from "./components/header";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
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
  return {
    lesson,
    course,
    classTitle,
    chapterTitle,
    classId,
    lessonId,
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
  return (
    <SidebarProvider defaultOpen={false}>
      <LessonSidebar
        course={loaderData.course}
        classTitle={loaderData.classTitle.title}
      />
      <SidebarInset>
        <Header
          classId={loaderData.classId}
          classTitle={loaderData.classTitle.title}
          chapterTitle={loaderData.chapterTitle.title}
          lessonTitle={loaderData.lesson.title}
          onBookmarkClick={absordclick}
        />
        <div className="bg-amber-300 w-full h-full">
          {loaderData.lesson.title}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
