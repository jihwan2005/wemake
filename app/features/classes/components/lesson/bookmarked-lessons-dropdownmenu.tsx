import { BookmarkCheck } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";

type myLessonProps = {
  myLessons: {
    title: string | null;
    class_post_id: number | null;
    lesson_id: string | null;
  }[];
};

export default function BookMarkedLessonsDropdownMenu({
  myLessons,
}: myLessonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <BookmarkCheck
            className={`size-4 ${myLessons.length > 0 ? "text-red-600" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <DropdownMenuLabel>My Lessons</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {myLessons.length > 0 ? (
            myLessons.map((lesson) => (
              <DropdownMenuItem key={lesson.title}>
                <Link
                  to={`/classes/${lesson.class_post_id}/${lesson.lesson_id}`}
                >
                  {lesson.title}
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              북마크한 레슨이 없습니다
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
