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
  }: {
    keyword?: string;
    sorting: "title" | "description" | "teacher" | "hashtag";
    order: "upvotes" | "learners" | "reviews";
  }
) => {
  const columnMap: Record<typeof sorting, string> = {
    title: "title",
    description: "description",
    teacher: "author_username",
    hashtag: "hashtags",
  };

  const dbColumn = columnMap[sorting];
  if (sorting === "hashtag") {
    const { data, error } = await client.from("class_list_view").select("*");
    if (error) throw error;
    if (!keyword) return data;
    let filtered = data;
    if (keyword) {
      filtered = data.filter((item) =>
        item.hashtags?.some((tag: string) =>
          tag.toLowerCase().includes(keyword.toLowerCase())
        )
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
  return data;
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
    .eq("class_post_id", Number(classId));
  if (error) throw error;
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
    .from("class_chapter_lesson")
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
      video_url
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
