import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/common/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/common/components/ui/collapsible";
import { Link } from "react-router";
import { Check, Lock } from "lucide-react";
import ProgressBar from "./progress";

type LessonSidebarProps = {
  course: {
    title: string | null;
    class_post_id: number;
    class_chapter_lesson: {
      lesson_id: string;
      title: string | null;
      is_completed: boolean | null;
      is_hidden?: boolean;
    }[];
  }[];
  classTitle: string;
  author: string;
  progress: number;
  userId: string;
};

export default function LessonSidebar({
  course,
  classTitle,
  progress,
  author,
  userId,
}: LessonSidebarProps) {
  return (
    <Sidebar className="z-50" variant="inset">
      <SidebarHeader>
        <div className="flex justify-center text-2xl">{classTitle}</div>
        <ProgressBar progress={progress} />
        <div className="flex justify-center">{progress}% 완료</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {course.map((cls) => (
              <Collapsible
                key={cls.title}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>{cls.title}</SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {cls.class_chapter_lesson.map((lesson) => {
                        const isHidden = lesson.is_hidden && author !== userId;

                        return (
                          <SidebarMenuSubItem key={lesson.lesson_id}>
                            <Link
                              to={
                                !isHidden
                                  ? `/classes/${cls.class_post_id}/${lesson.lesson_id}`
                                  : "#"
                              }
                              onClick={(e) => {
                                if (isHidden) e.preventDefault(); // 링크 이동 방지
                              }}
                            >
                              <SidebarMenuSubButton
                                className={
                                  isHidden
                                    ? "cursor-not-allowed text-gray-400"
                                    : ""
                                }
                              >
                                <div className="flex items-center gap-2">
                                  {isHidden && <Lock className="size-4" />}
                                  <span>{lesson.title}</span>
                                  {lesson.is_completed && (
                                    <Check className="size-4 text-green-500 ml-auto" />
                                  )}
                                </div>
                              </SidebarMenuSubButton>
                            </Link>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
