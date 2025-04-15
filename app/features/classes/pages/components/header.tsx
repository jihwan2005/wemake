import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/common/components/ui/breadcrumb";
import { Button } from "~/common/components/ui/button";
import { Bookmark } from "lucide-react";
import { SidebarTrigger } from "~/common/components/ui/sidebar";

interface HeaderProps {
  classId: number;
  classTitle: string;
  chapterTitle: string | null;
  lessonTitle: string | null;
  onBookmarkClick: () => void;
}

export default function Header({
  classId,
  classTitle,
  chapterTitle,
  lessonTitle,
  onBookmarkClick,
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
        <div className="mr-4">
          <Button variant="outline" onClick={onBookmarkClick}>
            <Bookmark className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
