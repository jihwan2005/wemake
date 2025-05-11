import { makeSSRClient } from "~/supa-client";
import {
  getChapterWithLessons,
  getCheckedGoals,
  getClassById,
  getClassCourse,
  getClassGoal,
  getClassNotifications,
  getClassNotify,
  getMyBookMarkLessons,
  getMyClassStudents,
  getReviewsById,
  getUserAttendance,
  getUserEmail,
  getUserReview,
} from "../../data/queries";
import { Hero } from "~/common/components/hero";
import { useState } from "react";
import { Link, redirect } from "react-router";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  createChapter,
  createClassNotify,
  createGoal,
  createLesson,
  deleteChapter,
  deleteClass,
  deleteClassNotify,
  deleteGoal,
  deleteLesson,
  toggleCheck,
  updateAllLessonHiddenProp,
  updateChapter,
  updateClass,
  updateClassNotify,
  updateGoal,
  updateLesson,
} from "../../data/mutations";
import { updateClassHashtags } from "../../data/mutations";
import AuthorInfoCard from "~/features/classes/components/etc/author-info-card";
import ClassCourse from "../../components/class/class-course";
import ClassActionButtons from "../../components/class/class-action-buttons";
import ClassCheckList from "../../components/class/class-check-list";
import EnrollClassDialog from "../../components/class/enroll-class-dialog";
import UpdateClassDialog from "../../components/class/update-class-dialog";
import DeleteClassDialog from "../../components/class/delete-class-dialog";
import CreateChapterDialog from "../../components/chapter/create-chapter-dialog";
import ClassAttendanceDialog from "../../components/class/class-attendance-dialog";
import ClassNotificationDialog from "../../components/class/class-notification-dialog";
import BookMarkedLessonsDropdownMenu from "../../components/lesson/bookmarked-lessons-dropdownmenu";
import ClassMyStudentsDialog from "../../components/class/class-my-students-dialog";
import { Button } from "~/common/components/ui/button";
import { FileQuestion, MessageSquare, Share2 } from "lucide-react";
import type { Route } from "./+types/class-page";

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
      const data = await client
        .from("class_showcase_images")
        .select("image_url")
        .eq("class_post_id", Number(classId));
      const allShowcaseUrls = (data.data ?? []).flatMap(
        (item) => item.image_url
      );
      await deleteClass(client, {
        classId,
        posterUrl: classData!.class_poster as string,
        showcaseUrl: allShowcaseUrls,
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
    const order = formData.get("order") as string;
    await updateChapter(client, {
      chapterId,
      title,
      order,
    });
    if (formData.has("isHiddenAll")) {
      await updateAllLessonHiddenProp(client, {
        chapterId,
        isHidden: formData.get("isHiddenAll") === "true",
      });
    }
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
      isHidden: formData.get("isHidden") === "on",
    });
  } else if (String(actionType) === "delete-lesson") {
    const lessonId = formData.get("lessonId") as string;
    await deleteLesson(client, {
      lessonId,
    });
  } else if (String(actionType) === "update-lesson") {
    const lessonId = formData.get("lesson_id") as string;
    const title = formData.get("title") as string;
    const order = formData.get("order") as string;
    await updateLesson(client, {
      lessonId,
      title,
      order,
      isHidden: formData.get("isHidden") === "on",
    });
  } else if (String(actionType) === "create-goal") {
    const text = formData.get("goal") as string;
    await createGoal(client, {
      userId,
      text,
      classId,
    });
  } else if (String(actionType) === "delete-goal") {
    const goalId = formData.get("goalId") as string;
    await deleteGoal(client, {
      goalId,
    });
  } else if (String(actionType) === "update-goal") {
    const goalId = formData.get("goalId") as string;
    const text = formData.get("text") as string;
    await updateGoal(client, {
      goalId,
      text,
    });
  } else if (String(actionType) === "check-goal") {
    const goalId = formData.get("goalId") as string;
    await toggleCheck(client, {
      goalId,
      userId,
    });
  } else if (String(actionType) === "create-notification") {
    const text = formData.get("notification") as string;
    await createClassNotify(client, {
      userId,
      classId,
      text,
    });
  } else if (String(actionType) === "update-notify") {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const notifyId = formData.get("notify_id") as string;
    await updateClassNotify(client, {
      title,
      content,
      notifyId,
    });
  } else if (String(actionType) === "delete-notify") {
    const notifyId = formData.get("notify_id") as string;
    await deleteClassNotify(client, {
      notifyId,
    });
  }
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
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
  const goals = await getClassGoal(client, {
    classId,
    userId,
  });
  const checkedGoals = await getCheckedGoals(client, {
    classId: Number(classId),
    userId,
  });
  const userAttendance = await getUserAttendance(client, {
    classId,
    userId,
  });
  const notifications = await getClassNotifications(client, {
    userId,
    classId,
  });
  const notify = await getClassNotify(client, { classId });
  const myCompletedClasses = await getChapterWithLessons(client, {
    classId: Number(classId),
  });
  const completedMap = new Map(
    myCompletedClasses.map((item) => [item.lesson_id, item.is_completed])
  );
  const clsCourseWithCompleted = clsCourse.map((chapter) => ({
    ...chapter,
    class_chapter_lesson: chapter.class_chapter_lesson.map((lesson: any) => ({
      ...lesson,
      is_completed: completedMap.get(lesson.lesson_id) ?? false,
    })),
  }));
  const myStudents = await getMyClassStudents(client, {
    classId,
  });
  return {
    cls,
    clsCourse,
    email,
    userId,
    review,
    classReviews,
    myLessons,
    classId,
    goals,
    checkedGoals,
    userAttendance,
    notifications,
    clsCourseWithCompleted,
    notify,
    myStudents,
  };
};

export default function ClassPage({ loaderData }: Route.ComponentProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="space-y-20">
      <div className="relative">
        {loaderData.cls.author_id !== loaderData.userId && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-4">
            <EnrollClassDialog
              title={loaderData.cls.title}
              classId={loaderData.cls.class_post_id}
              IsEnrolled={loaderData.cls.is_enrolled}
            />
            {loaderData.cls.is_enrolled && (
              <div>
                <ClassAttendanceDialog
                  classId={loaderData.classId}
                  attendance={loaderData.userAttendance}
                  startAt={loaderData.cls.start_at}
                  endAt={loaderData.cls.end_at}
                />
                <BookMarkedLessonsDropdownMenu
                  myLessons={loaderData.myLessons}
                />
              </div>
            )}
          </div>
        )}
        <Hero
          title={loaderData.cls.title}
          subtitle={`Welcome to my ${loaderData.cls.title} class`}
        />
        {loaderData.cls.is_enrolled ||
        loaderData.cls.author_id === loaderData.userId ? (
          <ClassNotificationDialog
            authorId={loaderData.cls.author_id}
            userId={loaderData.userId}
            classId={loaderData.classId}
            notifications={loaderData.notifications}
            notify={loaderData.notify}
          />
        ) : null}
      </div>
      <ClassMyStudentsDialog
        students={loaderData.myStudents}
        classId={loaderData.classId}
      />
      <Link to={`/classes/messages`}>
        <Button variant="outline">
          <MessageSquare className="size-4" />
        </Button>
      </Link>
      {loaderData.cls.is_enrolled || loaderData.cls.author_id ? (
        <Link to={`/classes/${loaderData.classId}/quiz`}>
          <Button variant="outline">
            <FileQuestion className="size-4" />
          </Button>
        </Link>
      ) : null}
      <Link to={`/classes/${loaderData.classId}/mindmaps`}>
        <Button variant="outline">
          <Share2 className="size-4" />
        </Button>
      </Link>
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
        <div className="col-span-2">
          {isOpen && (
            <div className="w-full max-w-3xl mx-auto">
              {loaderData.cls.author_id === loaderData.userId && (
                <div className="flex gap-3 items-center mb-5">
                  <CreateChapterDialog />
                  <UpdateClassDialog cls={loaderData.cls} />
                  <DeleteClassDialog />
                </div>
              )}
              <ClassCourse
                courses={loaderData.clsCourseWithCompleted}
                authorId={loaderData.cls.author_id}
                userId={loaderData.userId}
                classId={loaderData.cls.class_post_id}
                IsEnrolled={loaderData.cls.is_enrolled}
              />
            </div>
          )}
        </div>
        <div className="col-span-1">
          {loaderData.cls.is_enrolled ||
          loaderData.cls.author_id === loaderData.userId ? (
            <div>
              <ClassCheckList
                classId={loaderData.classId}
                checkedGoals={loaderData.checkedGoals}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
