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
import { Check } from "lucide-react";
import ProgressBar from "./progress";

type LessonSidebarProps = {
  course: {
    title: string | null;
    class_post_id: number;
    class_chapter_lesson: {
      lesson_id: string;
      title: string | null;
      is_completed: boolean | null;
    }[];
  }[];
  classTitle: string;
  progress: number;
};

export default function LessonSidebar({
  course,
  classTitle,
  progress,
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
                      {cls.class_chapter_lesson.map((lesson) => (
                        <SidebarMenuSubItem key={lesson.lesson_id}>
                          <Link
                            to={`/classes/${cls.class_post_id}/${lesson.lesson_id}`}
                          >
                            <SidebarMenuSubButton>
                              {lesson.title}
                              {lesson.is_completed ? (
                                <Check className="size-4" />
                              ) : null}
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
  );
}
