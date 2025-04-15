import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/common/components/ui/breadcrumb";
import { Button } from "~/common/components/ui/button";
import { Bookmark, CheckCircle } from "lucide-react";
import { SidebarTrigger } from "~/common/components/ui/sidebar";

interface HeaderProps {
  classId: number;
  classTitle: string;
  chapterTitle: string | null;
  lessonTitle: string | null;
  onBookmarkClick: () => void;
  IsBookmarked: boolean | null;
  onCompleteClick: () => void;
  IsCompleted: boolean | null;
}

export default function Header({
  classId,
  classTitle,
  chapterTitle,
  lessonTitle,
  onBookmarkClick,
  onCompleteClick,
  IsBookmarked,
  IsCompleted,
}: HeaderProps) {
  return (
    <header className="flex h-16">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/classes/${classId}`}>
                  {classTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{chapterTitle}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{lessonTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex gap-4 mr-4">
          <Button
            variant="outline"
            onClick={onCompleteClick}
            className={`${IsCompleted ? "text-green-500 fill-current" : ""}`}
          >
            <CheckCircle className="size-4" />
            {IsCompleted ? "수강 완료" : "완료하기"}
          </Button>
          <Button variant="outline" onClick={onBookmarkClick}>
            <Bookmark
              className={`size-4 ${
                IsBookmarked ? "text-red-600 fill-current" : ""
              }`}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
