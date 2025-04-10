import type { Route } from "./+types/class-page";
import { makeSSRClient } from "~/supa-client";
import { getClassById, getClassCourse, getUserEmail } from "../queries";
import { GraduationCap, List, Mail } from "lucide-react";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/common/components/ui/hover-card";
import { Link } from "react-router";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const cls = await getClassById(client, { classId: params.classId });
  const clsCourse = await getClassCourse(client, { classId: params.classId });
  const email = await getUserEmail({ userId: cls.author_id });
  return { cls, clsCourse, email };
};

export default function ClassPage({ loaderData }: Route.ComponentProps) {
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };
  return (
    <div className="space-y-20">
      <Hero
        title={loaderData.cls.title}
        subtitle={`Welcome to my ${loaderData.cls.title} class`}
      />
      <div className="flex mb-5 items-center gap-2">
        <Avatar className="size-14">
          <AvatarFallback>{loaderData.cls.author_username[0]}</AvatarFallback>
          {loaderData.cls.author_avatar && (
            <AvatarImage src={loaderData.cls.author_avatar} />
          )}
        </Avatar>
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <GraduationCap className="size-5" />
            <Link to={`/users/${loaderData.cls.author_username}`}>
              <span>{loaderData.cls.author_username}</span>
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <Mail className="size-4" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="underline cursor-pointer">
                  {loaderData.email}
                </span>
              </HoverCardTrigger>
              <HoverCardContent>
                <span>
                  If you have any questions, feel free to reach out via email.
                </span>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-1/7">
        <Button>Upload Lesson</Button>
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "모두 숨기기" : <List className="size-4" />}
        </Button>
      </div>

      {isOpen && (
        <div>
          {loaderData.clsCourse.map((course) => (
            <div key={course.chapter_id} className="space-y-4 w-1/2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <button
                  onClick={() => toggleChapter(course.chapter_id)}
                  className="text-sm text-blue-500 underline"
                >
                  {openChapters[course.chapter_id] ? (
                    "숨기기"
                  ) : (
                    <List className="size-6" />
                  )}
                </button>
              </div>

              {openChapters[course.chapter_id] && (
                <ul className="pl-4 space-y-2">
                  {course.class_chapter_lesson.map((lesson) => (
                    <li
                      key={lesson.lesson_id}
                      className="border p-2 rounded-md"
                    >
                      <div className="font-medium">{lesson.title}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
