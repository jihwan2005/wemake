import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
type DifficultyType = Database["public"]["Enums"]["difficulty_type"];

export const deleteClass = async (
  client: SupabaseClient<Database>,
  { classId, posterUrl }: { classId: string; posterUrl: string }
) => {
  function extractPosterPath(url: string): string {
    return url.replace(
      "https://trwxbnzdoifmjxezpanj.supabase.co/storage/v1/object/public/poster/",
      ""
    );
  }
  const posterPath = extractPosterPath(posterUrl);
  const { error: storageError } = await client.storage
    .from("poster")
    .remove([posterPath]);
  if (storageError) throw storageError;
  const { data, error } = await client
    .from("class_posts")
    .delete()
    .eq("class_post_id", Number(classId));
  if (error) throw error;
  return data;
};

export const updateClass = async (
  client: SupabaseClient<Database>,
  {
    title,
    description,
    start_at,
    end_at,
    field,
    difficulty_type,
    poster,
    classId,
  }: {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    field: string;
    difficulty_type: DifficultyType;
    poster: string;
    classId: string;
  }
) => {
  const { data, error } = await client
    .from("class_posts")
    .update({
      title,
      description,
      class_poster: poster,
      start_at,
      end_at,
      field,
      difficulty_type,
    })
    .eq("class_post_id", Number(classId));
  if (error) {
    throw error;
  }
  return data;
};

export const createChapter = async (
  client: SupabaseClient<Database>,
  { chapter, classId }: { chapter: string; classId: string }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .insert({
      title: chapter,
      class_post_id: Number(classId),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteChapter = async (
  client: SupabaseClient<Database>,
  { chapterId }: { chapterId: string }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .delete()
    .eq("chapter_id", chapterId)
    .single();
  if (error) throw error;
  return data;
};

export const updateChapter = async (
  client: SupabaseClient<Database>,
  { chapterId, title }: { chapterId: string; title: string }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .update({ title })
    .eq("chapter_id", chapterId)
    .single();
  if (error) throw error;
  return data;
};

export const createLesson = async (
  client: SupabaseClient<Database>,
  {
    lesson,
    chapterId,
    video,
  }: { lesson: string; chapterId: string; video: string }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .insert({
      title: lesson,
      chapter_id: chapterId,
      video_url: video,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteLesson = async (
  client: SupabaseClient<Database>,
  { lessonId }: { lessonId: string }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .delete()
    .eq("lesson_id", lessonId)
    .single();
  if (error) throw error;
  return data;
};

export const updateLesson = async (
  client: SupabaseClient<Database>,
  { lessonId, title }: { lessonId: string; title: string }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .update({ title })
    .eq("lesson_id", lessonId)
    .single();
  if (error) throw error;
  return data;
};

export const toggleEnrollment = async (
  client: SupabaseClient<Database>,
  { classId, userId }: { classId: string; userId: string }
) => {
  const { count } = await client
    .from("class_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("class_post_id", Number(classId))
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("class_enrollments").insert({
      class_post_id: Number(classId),
      profile_id: userId,
    });
  } else {
    await client
      .from("class_enrollments")
      .delete()
      .eq("class_post_id", Number(classId))
      .eq("profile_id", userId);
  }
};

export const toggleUpvote = async (
  client: SupabaseClient<Database>,
  { classId, userId }: { classId: string; userId: string }
) => {
  const { count } = await client
    .from("class_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("class_post_id", Number(classId))
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("class_upvotes").insert({
      class_post_id: Number(classId),
      profile_id: userId,
    });
  } else {
    await client
      .from("class_upvotes")
      .delete()
      .eq("class_post_id", Number(classId))
      .eq("profile_id", userId);
  }
};