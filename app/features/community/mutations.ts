import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
type DifficultyType = Database["public"]["Enums"]["difficulty_type"];
export const createPost = async (
  client: SupabaseClient<Database>,
  {
    title,
    category,
    content,
    userId,
  }: { title: string; category: string; content: string; userId: string }
) => {
  const { data: categoryData, error: categoryError } = await client
    .from("topics")
    .select("topic_id")
    .eq("slug", category)
    .single();
  if (categoryError) {
    throw categoryError;
  }
  const { data, error } = await client
    .from("posts")
    .insert({
      title,
      content,
      profile_id: userId,
      topic_id: categoryData.topic_id,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const createReply = async (
  client: SupabaseClient<Database>,
  {
    postId,
    reply,
    userId,
    topLevelId,
  }: { postId: string; reply: string; userId: string; topLevelId?: number }
) => {
  const { error } = await client.from("post_replies").insert({
    ...(topLevelId ? { parent_id: topLevelId } : { post_id: Number(postId) }),
    reply,
    profile_id: userId,
  });
  if (error) {
    throw error;
  }
};

export const createVideoReply = async (
  client: SupabaseClient<Database>,
  { videoId, reply, userId }: { videoId: string; reply: string; userId: string }
) => {
  const { data, error } = await client
    .from("videos_replies")
    .insert({
      video_id: Number(videoId),
      reply,
      profile_id: userId,
    })
    .select(
      `
      video_reply_id,
      reply,
      created_at,
      video_id,
      profile:profile_id (
        username,
        avatar
      )
      `
    )
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const toggleUpvote = async (
  client: SupabaseClient<Database>,
  { postId, userId }: { postId: string; userId: string }
) => {
  const { count } = await client
    .from("post_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", Number(postId))
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("post_upvotes").insert({
      post_id: Number(postId),
      profile_id: userId,
    });
  } else {
    await client
      .from("post_upvotes")
      .delete()
      .eq("post_id", Number(postId))
      .eq("profile_id", userId);
  }
};

export const toggleVideoUpvote = async (
  client: SupabaseClient<Database>,
  { videoId, userId }: { videoId: string; userId: string }
) => {
  const numericVideoId = Number(videoId);

  const { count } = await client
    .from("videos_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("video_id", numericVideoId)
    .eq("profile_id", userId);

  if (count === 0) {
    await client.from("videos_upvotes").insert({
      video_id: numericVideoId,
      profile_id: userId,
    });
  } else {
    await client
      .from("videos_upvotes")
      .delete()
      .eq("video_id", numericVideoId)
      .eq("profile_id", userId);
  }
};

export const toggleVote = async (
  client: SupabaseClient<Database>,
  {
    postId,
    userId,
    optionIndex,
  }: { postId: string; userId: string; optionIndex: number }
) => {
  const { count } = await client
    .from("user_votes")
    .select("*", { count: "exact", head: true })
    .eq("vote_post_id", Number(postId))
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("user_votes").insert({
      vote_post_id: Number(postId),
      profile_id: userId,
      vote_option_id: optionIndex,
    });
  } else {
    await client
      .from("user_votes")
      .delete()
      .eq("vote_post_id", Number(postId))
      .eq("profile_id", userId);
  }
};

export const createVideo = async (
  client: SupabaseClient<Database>,
  {
    title,
    description,
    videoUrl,
    userId,
    thumbnail,
  }: {
    title: string;
    description: string;
    videoUrl: string;
    userId: string;
    thumbnail: string;
  }
) => {
  const { data, error } = await client
    .from("videos")
    .insert({
      title,
      description,
      video_url: videoUrl,
      profile_id: userId,
      video_thumbnail: thumbnail,
    })
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateVideoInfo = async (
  client: SupabaseClient<Database>,
  {
    id,
    title,
    description,
  }: {
    id: string;
    title: string;
    description: string;
  }
) => {
  const { error } = await client
    .from("videos")
    .update({ title, description })
    .eq("video_id", Number(id));
  if (error) {
    throw error;
  }
};

export const updateVideoThumbnail = async (
  client: SupabaseClient<Database>,
  {
    id,
    videoThumbnail,
  }: {
    id: string;
    videoThumbnail: string;
  }
) => {
  const { error } = await client
    .from("videos")
    .update({ video_thumbnail: videoThumbnail })
    .eq("video_id", Number(id));
  if (error) {
    throw error;
  }
};

export async function deleteVideo(
  client: SupabaseClient<Database>,
  {
    videoId,
    videoUrl,
    thumbnailUrl,
  }: {
    videoId: string;
    videoUrl: string;
    thumbnailUrl: string;
  }
) {
  function extractFilePath(url: string): string {
    return url.replace(
      "https://trwxbnzdoifmjxezpanj.supabase.co/storage/v1/object/public/videos/",
      ""
    );
  }

  function extractThumbnailPath(url: string): string {
    return url.replace(
      "https://trwxbnzdoifmjxezpanj.supabase.co/storage/v1/object/public/thumbnail/",
      ""
    );
  }

  const videoPath = extractFilePath(videoUrl);
  const thumbnailPath = extractThumbnailPath(thumbnailUrl);
  const { error: storageError } = await client.storage
    .from("videos")
    .remove([videoPath]);

  const { error: thumbnailError } = await client.storage
    .from("thumbnail")
    .remove([thumbnailPath]);

  if (storageError) {
    throw new Error(
      `Failed to delete video from storage: ${storageError.message}`
    );
  }
  const { error: dbError } = await client
    .from("videos")
    .delete()
    .eq("video_id", Number(videoId));

  if (dbError) {
    console.error("❌ DB Delete Error:", dbError);
    throw new Error("Failed to delete video from database");
  }
}

export async function deleteReply(
  client: SupabaseClient<Database>,
  { replyId }: { replyId: string }
) {
  const { error } = await client
    .from("videos_replies")
    .delete()
    .eq("video_reply_id", Number(replyId));
  if (error) throw error;
}

export const upadateReply = async (
  client: SupabaseClient<Database>,
  { replyId, reply }: { replyId: string; reply: string }
) => {
  const { error } = await client
    .from("videos_replies")
    .update({ reply })
    .eq("video_reply_id", Number(replyId));
};

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
    .single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
};