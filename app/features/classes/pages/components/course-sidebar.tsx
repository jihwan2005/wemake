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
} from "~/common/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/common/components/ui/collapsible";
import { Link } from "react-router";

type LessonSidebarProps = {
  course: {
    title: string | null;
    class_post_id: number;
    class_chapter_lesson: {
      lesson_id: string;
      title: string | null;
    }[];
  }[];
  classTitle: string;
};

export default function LessonSidebar({
  course,
  classTitle,
}: LessonSidebarProps) {
  return (
    <Sidebar className="z-50" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mb-5">
            {classTitle}
          </SidebarGroupLabel>
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
