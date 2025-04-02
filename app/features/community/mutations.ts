import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

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
  const { error } = await client
    .from("post_replies")
    .insert({
      ...(topLevelId ? { parent_id: topLevelId } : { post_id: Number(postId) }),
      reply,
      profile_id: userId,
    });
  if (error) {
    throw error;
  }
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

