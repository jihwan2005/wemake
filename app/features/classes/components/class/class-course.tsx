import { useState } from "react";
import {
  List,
  EyeOff,
  MoreVertical,
  CheckCircleIcon,
  Lock,
} from "lucide-react";
import { Button } from "~/common/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import DeleteChapterDialog from "../chapter/delete-chapter-dialog";
import UpdateChapterDialog from "../chapter/update-chapter-dialog";
import CreateLessonDialog from "../lesson/create-lesson-dialog";
import DeleteLessonDialog from "../lesson/delete-lesson-dialog";
import UpdateLessonDialog from "../lesson/update-lesson-dialog";
import { Link } from "react-router";

interface Lesson {
  lesson_id: string;
  title: string | null;
  order: number | null;
  is_completed?: boolean;
  is_hidden?: boolean;
}

interface Chapter {
  chapter_id: string;
  title: string | null;
  order: number | null;
  class_chapter_lesson: Lesson[];
}

interface ClassCourseProps {
  courses: Chapter[];
  authorId: string;
  userId: string;
  classId: number;
  IsEnrolled: boolean;
}

export default function ClassCourse({
  courses,
  authorId,
  userId,
  classId,
  IsEnrolled,
}: ClassCourseProps) {
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {courses.map((course) => (
        <div key={course.chapter_id} className="space-y-4 w-full">
          <div className="flex items-center justify-between bg-gray-300 rounded-2xl p-3">
            <h2 className="text-xl font-semibold">
              {authorId === userId && (
                <span className="mr-3">{course.order}</span>
              )}
              {course.title}
            </h2>
            <div className="flex items-center gap-2">
              <Button onClick={() => toggleChapter(course.chapter_id)}>
                {openChapters[course.chapter_id] ? (
                  <EyeOff className="size-4" />
                ) : (
                  <List className="size-6" />
                )}
              </Button>
              {authorId === userId && (
                <Popover>
                  <PopoverTrigger asChild>
                    <MoreVertical className="size-6" />
                  </PopoverTrigger>
                  <PopoverContent className="w-45 h-25 flex flex-col gap-2 items-center justify-center">
                    <div className="flex gap-3 items-center">
                      <span>삭제하기</span>
                      <DeleteChapterDialog course={course} />
                    </div>
                    <div className="flex gap-3 items-center">
                      <span>수정하기</span>
                      <UpdateChapterDialog course={course} />
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          {openChapters[course.chapter_id] && (
            <ul className="pl-4 space-y-2">
              {authorId == userId ? (
                <CreateLessonDialog chapterId={course.chapter_id} />
              ) : null}
              {course.class_chapter_lesson.map((lesson) => (
                <li
                  key={lesson.lesson_id}
                  className="border p-2 rounded-md flex justify-between items-center"
                >
                  <Link
                    to={
                      !lesson.is_hidden && (IsEnrolled || authorId === userId)
                        ? `/classes/${classId}/lesson/${lesson.lesson_id}`
                        : "#"
                    }
                    onClick={(e) => {
                      if (
                        (lesson.is_hidden && userId !== authorId) ||
                        (!IsEnrolled && userId !== authorId)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className={`font-medium flex-1 ${
                      (lesson.is_hidden && userId !== authorId) ||
                      (!IsEnrolled && userId !== authorId)
                        ? "cursor-not-allowed text-gray-400"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center">
                      {authorId === userId && (
                        <span className="mr-2">{lesson.order}</span>
                      )}
                      {lesson.is_hidden ? (
                        <div className="flex items-center gap-2">
                          <Lock className="size-4" />
                          {lesson.title}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {lesson.is_completed ? (
                            <CheckCircleIcon className="text-green-400" />
                          ) : (
                            <CheckCircleIcon />
                          )}
                          {lesson.title}
                        </div>
                      )}
                    </div>
                  </Link>

                  {authorId === userId && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <MoreVertical
                          className="size-6"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.preventDefault()}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-45 h-25 flex flex-col gap-2 items-center justify-center">
                        <div className="flex gap-3 items-center">
                          <span>삭제하기</span>
                          <DeleteLessonDialog lesson={lesson} />
                        </div>
                        <div className="flex gap-3 items-center">
                          <span>수정하기</span>
                          <UpdateLessonDialog lesson={lesson} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
