import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin, type Database } from "~/supa-client";

export interface Review {
  class_post_id: number | null;
  class_review_id: number;
  created_at: string;
  profile_id: string;
  review: string;
  updated_at: string;
}

export const getClasses = async (
  client: SupabaseClient<Database>,
  {
    keyword,
    sorting,
    order,
    excludeUserId,
  }: {
    keyword?: string;
    sorting: "title" | "description" | "teacher" | "hashtag";
    order: "upvotes" | "learners" | "reviews";
    excludeUserId: string;
  }
) => {
  // 1. 제외할 class_post_id 목록 가져오기
  let excludeClassIds: number[] = [];

  if (excludeUserId) {
    const [created, registered] = await Promise.all([
      client
        .from("class_posts")
        .select("class_post_id")
        .eq("profile_id", excludeUserId),
      client
        .from("class_enrollments")
        .select("class_post_id")
        .eq("profile_id", excludeUserId),
    ]);

    if (created.error || registered.error) {
      throw created.error || registered.error;
    }

    const createdIds = created.data.map((c) => c.class_post_id);
    const registeredIds = registered.data.map((r) => r.class_post_id);
    excludeClassIds = [...new Set([...createdIds, ...registeredIds])];
  }

  // 2. 정렬 기준 매핑
  const columnMap: Record<typeof sorting, string> = {
    title: "title",
    description: "description",
    teacher: "author_username",
    hashtag: "hashtags",
  };

  const dbColumn = columnMap[sorting];

  // 3. hashtag 정렬 처리
  if (sorting === "hashtag") {
    const { data, error } = await client.from("class_list_view").select("*");
    if (error) throw error;

    let filtered = data;

    if (keyword) {
      filtered = filtered.filter((item) =>
        item.hashtags?.some((tag: string) =>
          tag.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    if (excludeClassIds.length > 0) {
      filtered = filtered.filter(
        (item) => !excludeClassIds.includes(item.class_post_id)
      );
    }

    return filtered.sort((a, b) => {
      const aVal =
        order === "upvotes"
          ? a.upvotes ?? 0
          : order === "learners"
          ? a.learners ?? 0
          : a.reviews ?? 0;

      const bVal =
        order === "upvotes"
          ? b.upvotes ?? 0
          : order === "learners"
          ? b.learners ?? 0
          : b.reviews ?? 0;

      return bVal - aVal;
    });
  }

  // 4. 기타 정렬 (title, description, teacher)
  const { data, error } = await client
    .from("class_list_view")
    .select("*")
    .ilike(dbColumn, `%${keyword ?? ""}%`)
    .order(
      order === "upvotes"
        ? "upvotes"
        : order === "learners"
        ? "learners"
        : "reviews",
      {
        ascending: false,
      }
    );

  if (error) throw error;

  const filteredData =
    excludeClassIds.length > 0
      ? data.filter((item) => !excludeClassIds.includes(item.class_post_id))
      : data;
  return filteredData;
};

export const getClassById = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: string }
) => {
  const { data, error } = await client
    .from("class_list_view")
    .select("*")
    .eq("class_post_id", Number(classId))
    .single();
  if (error) throw error;
  return data;
};

export const getClassCourse = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: string }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .select("*,class_chapter_lesson(*)")
    .eq("class_post_id", Number(classId))
    .order("order", { ascending: false });
  if (error) throw error;
  data?.forEach((chapter) => {
    chapter.class_chapter_lesson.sort((a: any, b: any) => b.order - a.order);
  });
  return data;
};

export const getUserEmail = async ({ userId }: { userId: string }) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error) throw error;
  return data?.user?.email;
};

export const getLessonById = async (
  client: SupabaseClient<Database>,
  { lessonId }: { lessonId: string }
) => {
  const { data, error } = await client
    .from("lesson_list_view")
    .select("*")
    .eq("lesson_id", lessonId)
    .single();
  if (error) throw error;
  return data;
};

export const getUserReview = async (
  client: SupabaseClient<Database>,
  { classId, userId }: { classId: number; userId: string }
): Promise<Review | null> => {
  const { data, error } = await client
    .from("class_reviews")
    .select("*")
    .eq("class_post_id", classId)
    .eq("profile_id", userId);
  if (error) throw error;
  return data.length > 0 ? data[0] : null;
};

export const getReviewsById = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: number }
) => {
  const { data, error } = await client
    .from("class_reviews")
    .select(
      `
    *,
    profiles (
      username,
      avatar
    )
  `
    )
    .eq("class_post_id", Number(classId));
  if (error) throw error;
  return data;
};

export const getMyClasses = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("class_enrollments")
    .select("*")
    .eq("profile_id", userId);
  const classPostIds = data?.map((item) => item.class_post_id) ?? [];
  const { data: classes, error: postsError } = await client
    .from("class_list_view")
    .select("*")
    .in("class_post_id", classPostIds);

  if (postsError) throw postsError;
  return classes;
};

export const getAuthorIdByClassId = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: number }
) => {
  const { data, error } = await client
    .from("class_list_view")
    .select("author_id")
    .eq("class_post_id", classId);
  if (error) throw error;
  return data[0];
};

export const getMyMakingClasses = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("class_list_view")
    .select("*")
    .eq("author_id", userId);
  if (error) throw error;
  return data;
};

export const getCourseList = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: number }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .select(
      `
    chapter_id,
    class_post_id,
    title,
    class_chapter_lesson (
      lesson_id,
      title,
      video_url,
      is_hidden
    )
  `
    )
    .eq("class_post_id", classId);
  if (error) throw error;
  return data;
};

export const getKeywordRanking = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("keyword_ranking")
    .select("*")
    .order("keyword_frequency", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data;
};

export const getChapterTitleByLessonId = async (
  client: SupabaseClient<Database>,
  { lessonId }: { lessonId: string }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .select("chapter_id")
    .eq("lesson_id", lessonId)
    .single();
  if (error) throw error;
  const chapterId = data?.chapter_id;
  const { data: chapter, error: chapterError } = await client
    .from("class_chapter")
    .select("title")
    .eq("chapter_id", chapterId)
    .single();
  if (chapterError) throw chapterError;
  return chapter;
};

export const getMyBookMarkLessons = async (
  client: SupabaseClient<Database>,
  { userId, classId }: { userId: string; classId: string }
) => {
  const { data, error } = await client
    .from("bookmarked_lesson_list_view")
    .select("*")
    .eq("profile_id", userId);
  const LessonsIds = data?.map((item) => item.lesson_id) ?? [];
  const { data: lessons, error: lessonsError } = await client
    .from("lesson_list_view")
    .select("title,class_post_id,lesson_id")
    .in("lesson_id", LessonsIds)
    .eq("class_post_id", Number(classId));
  if (lessonsError) throw lessonsError;
  return lessons;
};

export const getChapterWithLessons = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: number }
) => {
  const { data, error } = await client
    .from("chapter_with_lessons_view")
    .select("*")
    .eq("class_post_id", classId);
  if (error) throw error;
  return data;
};

export const getClassGoal = async (
  client: SupabaseClient<Database>,
  { classId, userId }: { classId: string; userId: string }
) => {
  const { data, error } = await client
    .from("class_goals")
    .select("*")
    .eq("class_post_id", Number(classId))
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getCheckedGoals = async (
  client: SupabaseClient<Database>,
  { classId, userId }: { classId: number; userId: string }
) => {
  const { data, error } = await client
    .from("checked_goal_list_view")
    .select("*")
    .eq("class_post_id", classId)
    .eq("profile_id", userId);
  if (error) throw error;
  return data;
};

export const getUserAttendance = async (
  client: SupabaseClient<Database>,
  { userId, classId }: { userId: string; classId: string }
) => {
  const { data, error } = await client
    .from("class_attendance_with_status")
    .select("*")
    .eq("profile_id", userId)
    .eq("class_post_id", Number(classId));
  if (error) throw error;
  return data;
};

export const getClassNotifications = async (
  client: SupabaseClient<Database>,
  { userId, classId }: { userId: string; classId: string }
) => {
  const { data, error } = await client
    .from("notification_class_view")
    .select(
      `
      notification_id,
      type,
      source:profiles!source_id(
        profile_id,
        name,
        avatar
      ),
      lesson:lesson_list_view!lesson_id(
        lesson_id,
        title
      ),
      notify:class_notify!notify_id(
        notify_id,
        notify_title
      ),
      message:class_message!class_message_id(
        class_message_id,
        message_content
      ),
      class_title,
      seen,
      created_at
      `
    )
    .eq("target_id", userId)
    .eq("class_post_id", Number(classId))
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const getClassNotify = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: string }
) => {
  const { data, error } = await client
    .from("class_notify")
    .select("*")
    .eq("class_post_id", Number(classId))
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getCertificateByUserId = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("certificate_view")
    .select("*")
    .eq("profile_id", userId)
    .order("issued_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getMyClassStudents = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: string }
) => {
  const { data, error } = await client
    .from("class_enrollments")
    .select(
      `
      enrolled_at,
      profiles (
        profile_id,
        username
      )
    `
    )
    .eq("class_post_id", Number(classId));
  if (error) throw error;
  return data;
};

export const getClassMessages = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("class_messages_view")
    .select("*")
    .eq("profile_id", userId)
    .neq("other_profile_id", userId)
    .order("unread_count", { ascending: false })
    .order("last_message_created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const getClassMessagesByClassMessagesRoomId = async (
  client: SupabaseClient<Database>,
  { messageRoomId, userId }: { messageRoomId: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("class_message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("class_message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { data, error } = await client
    .from("class_message")
    .select(
      `*,
        created_at,
        class_message_images(*)
      `
    )
    .eq("class_message_room_id", Number(messageRoomId))
    .order("created_at", { ascending: true });
  if (error) {
    throw error;
  }
  return data;
};

export const getClassRoomsParticipant = async (
  client: SupabaseClient<Database>,
  { messageRoomId, userId }: { messageRoomId: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("class_message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("class_message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { data, error } = await client
    .from("class_message_room_members")
    .select(
      `
      profile:profiles!profile_id!inner(
        name,
        profile_id,
        avatar
      )
      `
    )
    .eq("class_message_room_id", Number(messageRoomId))
    .neq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const sendClassMessageToRoom = async (
  client: SupabaseClient<Database>,
  {
    messageRoomId,
    message,
    userId,
    isRead,
  }: { messageRoomId: string; message: string; userId: string; isRead: boolean }
) => {
  const { count, error: countError } = await client
    .from("class_message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("class_message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { data, error } = await client
    .from("class_message")
    .insert({
      message_content: message,
      class_message_room_id: Number(messageRoomId),
      sender: userId,
      is_read: isRead,
    })
    .select();
  if (error) {
    throw error;
  }
  return data[0].class_message_id;
};

export const getUnReadClassMessages = async (
  client: SupabaseClient<Database>,
  { classRoomId }: { classRoomId: string }
) => {
  const { data, error } = await client
    .from("class_message")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .eq("class_message_room_id", Number(classRoomId));

  if (error) throw error;
  return data;
};

export const getClassMessageRoomNotification = async (
  client: SupabaseClient<Database>,
  { roomId }: { roomId: string }
) => {
  const { data, error } = await client
    .from("class_message_room_notification")
    .select("*")
    .eq("class_message_room_id", Number(roomId));
  if (error) throw error;
  return data;
};

export const getClassQuizzesByClassId = async (
  client: SupabaseClient<Database>,
  { classId }: { classId: string }
) => {
  const { data, error } = await client
    .from("class_quizzes")
    .select("*")
    .eq("class_post_id", Number(classId))
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getClassQuestionByQuizId = async (
  client: SupabaseClient<Database>,
  { quizId }: { quizId: string }
) => {
  const { data, error } = await client
    .from("class_quiz_questions")
    .select("*, class_quiz_choices(*)")
    .eq("quiz_id", Number(quizId))
    .order("question_position", { ascending: true });

  if (error) throw error;
  return data;
};