import type { Route } from "./+types/class-page";
import { makeSSRClient } from "~/supa-client";
import { getClassById, getClassCourse, getUserEmail } from "../queries";
import { List, Upload, Pencil, Plus } from "lucide-react";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { useState } from "react";

import { Form, redirect } from "react-router";
import { getLoggedInUserId } from "~/features/users/queries";

import {
  createChapter,
  deleteChapter,
  deleteClass,
  updateChapter,
  updateClass,
} from "../mutations";

import { Input } from "~/common/components/ui/input";

import { updateClassHashtags } from "~/features/community/mutations";
import DeleteClassDialog from "~/features/classes/components/delete-class-dialog";
import UpdateClassDialog from "~/features/classes/components/update-class-dialog";
import DeleteChapterDialog from "~/features/classes/components/delete-chapter-dialog";
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
  } else if (String(actionType) === "chapter") {
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
    const chapterId = formData.get("chapterId") as string;
    const title = formData.get("chapterTitle") as string;
    await updateChapter(client, {
      chapterId,
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
  const [selectedChapter, setSelectedChapter] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openChapter, setOpenChapter] = useState(false);
  const [updateOpen, setUpdateOpen] = useState<string | null>(null);
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
          <div className="flex gap-3">
            <Button onClick={() => setOpenChapter((prev) => !prev)}>
              <Upload className="size-4" />
              Chapter
            </Button>
            <UpdateClassDialog cls={loaderData.cls} />
            <DeleteClassDialog />
          </div>
        ) : null}
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "모두 숨기기" : <List className="size-4" />}
        </Button>
      </div>
      <Form method="post">
        <input type="hidden" name="actionType" value="chapter" />
        {openChapter && (
          <div className="flex gap-2">
            <Input
              placeholder="Add Chapter"
              className="w-1/3"
              id="chapter"
              name="chapter"
            />

            <Button>
              <Plus className="size-4" />
            </Button>
          </div>
        )}
      </Form>

      {isOpen && (
        <div>
          {loaderData.clsCourse.map((course) => (
            <div key={course.chapter_id} className="space-y-4 w-1/2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <Form method="post">
                  <input
                    type="hidden"
                    name="actionType"
                    value="update-chapter"
                  />
                  <input
                    type="hidden"
                    name="chapterId"
                    value={course.chapter_id}
                  />
                  {updateOpen === course.chapter_id ? (
                    <>
                      <Input
                        className="w-1/2"
                        defaultValue={course.title + ""}
                        name="chapterTitle"
                      />
                      <Button type="submit" className="ml-2 bg-primary">
                        저장하기
                      </Button>
                    </>
                  ) : null}
                </Form>

                <DeleteChapterDialog course={course} />
                <Button
                  onClick={() => {
                    setSelectedChapter({
                      id: course.chapter_id,
                      title: course.title + "",
                    });
                    setUpdateOpen((prev) =>
                      prev === course.chapter_id ? null : course.chapter_id
                    );
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button onClick={() => toggleChapter(course.chapter_id)}>
                  {openChapters[course.chapter_id] ? (
                    "숨기기"
                  ) : (
                    <List className="size-6" />
                  )}
                </Button>
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
