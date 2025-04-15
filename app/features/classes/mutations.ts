import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
type DifficultyType = Database["public"]["Enums"]["difficulty_type"];

export const createClass = async (
  client: SupabaseClient<Database>,
  {
    title,
    description,
    start_at,
    end_at,
    field,
    difficulty_type,
    poster,
    userId,
  }: {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    userId: string;
    field: string;
    difficulty_type: DifficultyType;
    poster: string;
  }
) => {
  const { data, error } = await client
    .from("class_posts")
    .insert({
      title,
      description,
      class_poster: poster,
      profile_id: userId,
      start_at,
      end_at,
      field,
      difficulty_type,
    })
    .select()
    .single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
};

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
  }: { lesson: string; chapterId: string; video: string | null }
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

export const createReview = async (
  client: SupabaseClient<Database>,
  {
    classId,
    userId,
    review,
  }: { classId: number; userId: string; review: string }
) => {
  const { data, error } = await client
    .from("class_reviews")
    .insert({
      class_post_id: classId,
      profile_id: userId,
      review: review,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteReview = async (
  client: SupabaseClient<Database>,
  { reviewId }: { reviewId: string }
) => {
  const { data, error } = await client
    .from("class_reviews")
    .delete()
    .eq("class_review_id", Number(reviewId))
    .single();
  if (error) throw error;
  return data;
};

export const updateReview = async (
  client: SupabaseClient<Database>,
  { reviewId, review }: { reviewId: string; review: string }
) => {
  const { data, error } = await client
    .from("class_reviews")
    .update({ review })
    .eq("class_review_id", Number(reviewId))
    .single();
  if (error) throw error;
  return data;
};

export async function createHashtagIfNotExists(
  client: SupabaseClient<Database>,
  tag: string
) {
  const { data, error } = await client
    .from("hashtags")
    .select("*")
    .eq("tag", tag)
    .maybeSingle();

  if (error) throw error;

  if (data) return data;

  const { data: inserted, error: insertError } = await client
    .from("hashtags")
    .insert({ tag })
    .select()
    .single();

  if (insertError) throw insertError;

  return inserted;
}

export async function linkHashtagToClass(
  client: SupabaseClient<Database>,
  class_post_id: number,
  hashtag_id: string
) {
  const { error } = await client.from("classPost_with_hashtags").insert({
    class_post_id,
    hashtag_id,
  });

  if (error) throw error;
}

export async function updateClassHashtags(
  client: SupabaseClient<Database>,
  classId: number,
  newTags: string[]
) {
  const { data: existingLinks, error: fetchError } = await client
    .from("classPost_with_hashtags")
    .select("hashtag_id, hashtags(tag)")
    .eq("class_post_id", classId);
  if (fetchError) throw fetchError;

  const existingTags = new Map(
    (existingLinks ?? []).map((link) => [
      link.hashtags.tag.toLowerCase(),
      link.hashtag_id,
    ])
  );

  const newTagSet = new Set(newTags.map((tag) => tag.toLowerCase()));

  for (const tag of newTags) {
    const lowerTag = tag.toLowerCase();
    if (!existingTags.has(lowerTag)) {
      const { data: tagData, error } = await client
        .from("hashtags")
        .upsert({ tag: lowerTag }, { onConflict: "tag" })
        .select()
        .single();
      if (error) throw error;

      await client.from("classPost_with_hashtags").insert({
        class_post_id: classId,
        hashtag_id: tagData.hashtag_id,
      });
    }
  }

  for (const [tagName, hashtagId] of existingTags.entries()) {
    if (!newTagSet.has(tagName)) {
      await client
        .from("classPost_with_hashtags")
        .delete()
        .eq("class_post_id", classId)
        .eq("hashtag_id", hashtagId);
    }
  }
}

export const createKeyword = async (
  client: SupabaseClient<Database>,
  { keyword }: { keyword: string }
) => {
  const normalizedKeyword = keyword.trim().replace(/\s+/g, "").toLowerCase();

  const { data: existing, error: fetchError } = await client
    .from("keyword_ranking")
    .select("*")
    .eq("keyword_text", normalizedKeyword)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { data: updated, error: updateError } = await client
      .from("keyword_ranking")
      .update({ keyword_frequency: (existing.keyword_frequency ?? 0) + 1 })
      .eq("keyword_id", existing.keyword_id)
      .select()
      .single();

    if (updateError) throw updateError;
    return updated;
  } else {
    const { data: inserted, error: insertError } = await client
      .from("keyword_ranking")
      .insert({
        keyword_text: normalizedKeyword,
        keyword_frequency: 1,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return inserted;
  }
};

export const toggleBookMark = async (
  client: SupabaseClient<Database>,
  { lessonId, userId }: { lessonId: string; userId: string }
) => {
  const { count } = await client
    .from("bookmarked_lesson")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", lessonId)
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("bookmarked_lesson").insert({
      lesson_id: lessonId,
      profile_id: userId,
    });
  } else {
    await client
      .from("bookmarked_lesson")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("profile_id", userId);
  }
};