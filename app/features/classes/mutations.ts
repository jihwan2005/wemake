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