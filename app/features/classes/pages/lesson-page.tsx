import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/lesson-page";
import { getClassById, getCourseList, getLessonById } from "../queries";
import { Button } from "~/common/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "~/common/components/ui/sidebar";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/common/components/ui/collapsible";
import { Link } from "react-router";

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
  const [open, setOpen] = useState(false);
  const sidebarToggle = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="space-y-20">
      <Button className="bg-green-500">완료</Button>
      <Button onClick={sidebarToggle}>슬라이드</Button>
      <span>{loaderData.lesson.title}</span>
      <div>
        {loaderData.lesson.video_url && (
          <video className="w-full">
            <source src={loaderData.lesson.video_url} type="video/mp4" />
          </video>
        )}
      </div>
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className="flex max-h-[calc(100vh-14rem)] overflow-hidden h-[calc(100vh-14rem)] min-h-full"
      >
        <Sidebar className="z-50" variant="inset">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-2xl mb-5">
                {loaderData.classTitle.title}
              </SidebarGroupLabel>
              <SidebarMenu>
                {loaderData.course.map((cls) => (
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>{cls.title}</SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {cls.class_chapter_lesson.map((lesson) => (
                            <SidebarMenuSubItem>
                              <Link
                                to={`/classes/${cls.class_post_id}/${lesson.lesson_id}`}
                              >
                                <SidebarMenuSubButton>
                                  {lesson.title}
                                </SidebarMenuSubButton>
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
