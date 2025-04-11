import type { Route } from "./+types/class-page";
import { makeSSRClient } from "~/supa-client";
import { getClassById, getClassCourse, getUserEmail } from "../queries";
import { List, MoreVertical, EyeOff } from "lucide-react";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { useState } from "react";
import { redirect } from "react-router";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  createChapter,
  createLesson,
  deleteChapter,
  deleteClass,
  deleteLesson,
  updateChapter,
  updateClass,
  updateLesson,
} from "../mutations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import { updateClassHashtags } from "~/features/community/mutations";
import DeleteClassDialog from "~/features/classes/components/delete-class-dialog";
import UpdateClassDialog from "~/features/classes/components/update-class-dialog";
import DeleteChapterDialog from "~/features/classes/components/delete-chapter-dialog";
import UpdateChapterDialog from "~/features/classes/components/update-chapter-dialog";
import CreateChapterDialog from "~/features/classes/components/create-chapter-dialog";
import CreateLessonDialog from "~/features/classes/components/create-lesson-dialog";
import DeleteLessonDialog from "~/features/classes/components/delete-lesson-dialog";
import UpdateLessonDialog from "~/features/classes/components/update-lesson-dialog";
import AuthorInfoCard from "~/features/classes/components/author-info-card";

function parseHashtags(input: string): string[] {
  return input
    .split(/[\s,]+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter((tag) => tag.length > 0);
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const formData = await request.formData();
  console.log(formData);
  const actionType = formData.get("actionType");
  if (String(actionType) === "delete") {
    try {
      const { data: classData } = await client
        .from("class_posts")
        .select("class_poster")
        .eq("class_post_id", Number(classId))
        .single();
      await deleteClass(client, {
        classId,
        posterUrl: classData!.class_poster as string,
      });
      return redirect("/classes");
    } catch (error) {
      return { formErrors: { delete: ["Failed to delete video"] } };
    }
  } else if (String(actionType) === "update") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const field = formData.get("field") as string;
    const difficulty_type = formData.get("difficulty_type") as
      | "beginner"
      | "intermediate"
      | "advanced";
    const start_at = formData.get("start_at") as string;
    const end_at = formData.get("end_at") as string;
    const rawHashtags = formData.get("hashtags") as string;
    const hashtags = parseHashtags(rawHashtags);
    const poster = formData.get("poster") as File;
    let newPosterUrl = null;
    const { data: posterData, error: posterError } = await client
      .from("class_posts")
      .select("class_poster")
      .eq("class_post_id", Number(classId))
      .single();
    const oldPosterUrl = posterData?.class_poster;
    if (poster && poster instanceof File && poster.size > 0) {
      if (oldPosterUrl) {
        const fileName = oldPosterUrl.split("/").pop();
        await client.storage.from("poster").remove([`${userId}/${fileName}`]);
      }
    }
    const filePath = `${userId}/${Date.now()}`;
    const { error: uploadError } = await client.storage
      .from("poster")
      .upload(filePath, poster, { contentType: poster.type });

    if (uploadError) {
      return { formErrors: { thumbnail: ["Failed to upload poster"] } };
    }
    const { data: urlData } = await client.storage
      .from("poster")
      .getPublicUrl(filePath);
    newPosterUrl = urlData.publicUrl;
    await updateClassHashtags(client, Number(classId), hashtags);
    await updateClass(client, {
      title,
      description,
      poster: newPosterUrl,
      classId,
      field,
      difficulty_type,
      start_at,
      end_at,
    });
  } else if (String(actionType) === "create-chapter") {
    const chapter = formData.get("chapter") as string;
    await createChapter(client, {
      chapter,
      classId,
    });
  } else if (String(actionType) === "delete-chapter") {
    const chapterId = formData.get("chapterId") as string;
    await deleteChapter(client, {
      chapterId,
    });
    return redirect(`/classes/${classId}`);
  } else if (String(actionType) === "update-chapter") {
    const chapterId = formData.get("chapter_id") as string;
    const title = formData.get("title") as string;
    await updateChapter(client, {
      chapterId,
      title,
    });
  } else if (String(actionType) === "create-lesson") {
    const chapterId = formData.get("chapterId") as string;
    const lesson = formData.get("lesson") as string;
    await createLesson(client, {
      chapterId,
      lesson,
    });
  } else if (String(actionType) === "delete-lesson") {
    const lessonId = formData.get("lessonId") as string;
    await deleteLesson(client, {
      lessonId,
    });
  } else if (String(actionType) === "update-lesson") {
    const lessonId = formData.get("lesson_id") as string;
    const title = formData.get("title") as string;
    await updateLesson(client, {
      lessonId,
      title,
    });
  }
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const cls = await getClassById(client, { classId: params.classId });
  const clsCourse = await getClassCourse(client, { classId: params.classId });
  const email = await getUserEmail({ userId: cls.author_id });
  return { cls, clsCourse, email, userId };
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
      <AuthorInfoCard
        username={loaderData.cls.author_username}
        avatarUrl={loaderData.cls.author_avatar}
        email={loaderData.email}
      />
      <div className="flex flex-col gap-4 w-1/7">
        {loaderData.cls.author_id == loaderData.userId ? (
          <div className="flex gap-3 items-center">
            <UpdateClassDialog cls={loaderData.cls} />
            <DeleteClassDialog />
          </div>
        ) : null}
        <div className="flex gap-4">
          <CreateChapterDialog />
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <EyeOff className="size-4" />
            ) : (
              <List className="size-4" />
            )}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-5">
          {loaderData.clsCourse.map((course) => (
            <div key={course.chapter_id} className="space-y-4 w-1/2">
              <div className="flex items-center justify-between bg-gray-300 rounded-2xl p-3">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <div className="flex items-center gap-2">
                  <Button onClick={() => toggleChapter(course.chapter_id)}>
                    {openChapters[course.chapter_id] ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <List className="size-6" />
                    )}
                  </Button>
                  {loaderData.cls.author_id == loaderData.userId ? (
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
                  ) : null}
                </div>
              </div>
              {openChapters[course.chapter_id] && (
                <ul className="pl-4 space-y-2">
                  <CreateLessonDialog chapterId={course.chapter_id} />
                  {course.class_chapter_lesson.map((lesson) => (
                    <li
                      key={lesson.lesson_id}
                      className="border p-2 rounded-md flex justify-between"
                    >
                      <div className="font-medium">{lesson.title}</div>
                      {loaderData.cls.author_id == loaderData.userId ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <MoreVertical className="size-6" />
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
                      ) : null}
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
