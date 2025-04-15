import type { Route } from "./+types/class-page";
import { makeSSRClient } from "~/supa-client";
import {
  getClassById,
  getClassCourse,
  getMyBookMarkLessons,
  getReviewsById,
  getUserEmail,
  getUserReview,
} from "../queries";
import { Hero } from "~/common/components/hero";
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
import { updateClassHashtags } from "../mutations";
import AuthorInfoCard from "~/features/classes/components/etc/author-info-card";
import ClassCourse from "../components/class/class-course";
import ClassActionButtons from "../components/class/class-action-buttons";
import { ListCheck } from "lucide-react";
import ClassCheckList from "../components/class/class-check-list";

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
    const video = formData.get("lessonVideo") as File;
    let videoUrl: string | null = null;
    if (video && video.size > 0 && video.name) {
      const filePath = `${userId}/${Date.now()}`;
      const { data, error } = await client.storage
        .from("lesson-video")
        .upload(filePath, video, {
          contentType: "video/mp4",
        });

      if (error) {
        console.error("영상 업로드 실패:", error.message);
        throw new Error("영상 업로드 실패");
      }

      const {
        data: { publicUrl },
      } = client.storage.from("lesson-video").getPublicUrl(filePath);

      videoUrl = publicUrl;
    }
    await createLesson(client, {
      chapterId,
      lesson,
      video: videoUrl,
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
  const review = await getUserReview(client, {
    userId,
    classId: Number(params.classId),
  });
  const classReviews = await getReviewsById(client, {
    classId: Number(params.classId),
  });
  const myLessons = await getMyBookMarkLessons(client, {
    userId,
    classId: params.classId,
  });
  return {
    cls,
    clsCourse,
    email,
    userId,
    review,
    classReviews,
    myLessons,
  };
};

export default function ClassPage({ loaderData }: Route.ComponentProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="space-y-20">
      <Hero
        title={loaderData.cls.title}
        subtitle={`Welcome to my ${loaderData.cls.title} class`}
      />
      <div className="grid grid-cols-4 gap-4 w-full items-start">
        <div className="col-span-1 sticky top-0 self-start ml-[48.25px]">
          <AuthorInfoCard
            username={loaderData.cls.author_username}
            avatarUrl={loaderData.cls.author_avatar}
            email={loaderData.email}
          />
          <ClassActionButtons
            authorId={loaderData.cls.author_id}
            userId={loaderData.userId}
            cls={loaderData.cls}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            IsEnrolled={loaderData.cls.is_enrolled}
            IsUpvoted={loaderData.cls.is_upvoted}
            IsReviewed={loaderData.cls.is_reviewed}
            userReview={loaderData.review}
            classReviews={loaderData.classReviews}
            myLessons={loaderData.myLessons}
          />
        </div>

        <div className="col-span-1 sticky top-0 self-start">
          <ClassCheckList />
        </div>

        <div className="col-span-2">
          {isOpen && (
            <div className="w-full max-w-3xl mx-auto">
              <ClassCourse
                courses={loaderData.clsCourse}
                authorId={loaderData.cls.author_id}
                userId={loaderData.userId}
                classId={loaderData.cls.class_post_id}
                IsEnrolled={loaderData.cls.is_enrolled}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
