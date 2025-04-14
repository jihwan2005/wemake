import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/lesson-page";
import { getClassById, getCourseList, getLessonById } from "../queries";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/common/components/ui/sidebar";

import LessonSidebar from "./components/course-sidebar";
import { Separator } from "~/common/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";

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
        <header className="flex h-16">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {loaderData.classTitle.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{loaderData.lesson.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="bg-amber-300 w-full h-full"></div>
      </SidebarInset>
    </SidebarProvider>
  );
}
