import type { SupabaseClient } from "@supabase/supabase-js";
import { select } from "motion/react-client";
import { supabaseAdmin, type Database } from "~/supa-client";

export const getClasses = async (
  client: SupabaseClient<Database>,
  {
    keyword,
    sorting,
  }: {
    keyword?: string;
    sorting: "title" | "description" | "teacher" | "hashtag";
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
    return data.filter((item) =>
      item.hashtags?.some((tag: string) =>
        tag.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
  const { data, error } = await client
    .from("class_list_view")
    .select("*")
    .ilike(dbColumn, `%${keyword ?? ""}%`);

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
