import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/lesson-page";
import { getClassById, getCourseList, getLessonById } from "../queries";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/common/components/ui/sidebar";
import { useState } from "react";

import LessonSidebar from "./components/course-sidebar";

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
  return { lesson, course, classTitle };
};

export default function LessonPage({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <LessonSidebar
        course={loaderData.course}
        classTitle={loaderData.classTitle.title}
      />
      <SidebarInset>
        <SidebarTrigger />
        <span>{loaderData.lesson.title}</span>
        <div>
          {loaderData.lesson.video_url && (
            <video className="w-full">
              <source src={loaderData.lesson.video_url} type="video/mp4" />
            </video>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
