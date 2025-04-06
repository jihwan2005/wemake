import { DateTime } from "luxon";

import { PAGE_SIZE } from "./constants";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getTopics = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("topics").select("name, slug");
  if (error) throw new Error(error.message);
  return data;
};

export const getPosts = async (
  client: SupabaseClient<Database>,
  {
    limit,
    sorting,
    period = "all",
    keyword,
    topic,
    page = 1,
  }: {
    limit: number;
    sorting: "newest" | "popular";
    period?: "all" | "today" | "week" | "month" | "year";
    keyword?: string;
    topic?: string;
    page?: number;
  }
) => {
  const baseQuery = client
    .from("community_post_list_view")
    .select(`*`)
    .limit(limit)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (sorting === "newest") {
    baseQuery.order("created_at", { ascending: false });
  } else if (sorting === "popular") {
    if (period === "all") {
      baseQuery.order("upvotes", { ascending: false });
    } else {
      const today = DateTime.now();
      if (period === "today") {
        baseQuery.gte("created_at", today.startOf("day").toISO());
      } else if (period === "week") {
        baseQuery.gte("created_at", today.startOf("week").toISO());
      } else if (period === "month") {
        baseQuery.gte("created_at", today.startOf("month").toISO());
      } else if (period === "year") {
        baseQuery.gte("created_at", today.startOf("year").toISO());
      }
      baseQuery.order("upvotes", { ascending: false });
    }
  }

  if (keyword) {
    baseQuery.ilike("title", `%${keyword}%`);
  }

  if (topic) {
    baseQuery.eq("topic_slug", topic);
  }

  const { data, error } = await baseQuery;
  if (error) throw new Error(error.message);
  return data;
};

export const getPostPages = async (
  client: SupabaseClient<Database>,
  {
    period = "all",
    keyword,
    topic,
  }: {
    period?: "all" | "today" | "week" | "month" | "year";
    keyword?: string;
    topic?: string;
  }
) => {
  const baseQuery = client
    .from("community_post_list_view")
    .select("*", { count: "exact", head: true });

  if (period !== "all") {
    const today = DateTime.now();
    if (period === "today") {
      baseQuery.gte("created_at", today.startOf("day").toISO());
    } else if (period === "week") {
      baseQuery.gte("created_at", today.startOf("week").toISO());
    } else if (period === "month") {
      baseQuery.gte("created_at", today.startOf("month").toISO());
    } else if (period === "year") {
      baseQuery.gte("created_at", today.startOf("year").toISO());
    }
  }

  if (keyword) {
    baseQuery.ilike("title", `%${keyword}%`);
  }

  if (topic) {
    baseQuery.eq("topic_slug", topic);
  }

  const { count, error } = await baseQuery;
  if (error) throw new Error(error.message);
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};

export const getPostById = async (
  client: SupabaseClient<Database>,
  { postId }: { postId: string }
) => {
  const { data, error } = await client
    .from("community_post_detail")
    .select("*")
    .eq("post_id", Number(postId))
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getReplies = async (
  client: SupabaseClient<Database>,
  { postId }: { postId: string }
) => {
  const replyQuery = `
    post_reply_id,
    reply,
    created_at,
    user:profiles!inner (
      name,
      avatar,
      username
    )
  `;
  const { data, error } = await client
    .from("post_replies")
    .select(
      `
      ${replyQuery},
      post_replies (
        ${replyQuery}
      )
      `
    )
    .eq("post_id", Number(postId))
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getVideoReplies = async (
  client: SupabaseClient<Database>,
  { videoIds }: { videoIds: number[] }
) => {
  const { data, error } = await client
    .from("video_replies_list_view")
    .select("*")
    .in("video_id", videoIds)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getVotePosts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("vote_post_list_view").select(`*`);
  if (error) throw error;
  return data;
};

export const getVoteContent = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("vote_options_with_vote_status")
    .select(`*`);
  if (error) throw error;
  return data;
};

export const getVideos = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("video_list_view")
    .select(`*`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export type Video = {
  video_id: number;
  title: string;
  description: string;
  created_at: string;
  video_url: string;
  video_thumbnail: string;
  author: string;
  author_avatar: string | null;
  author_username: string;
};

export const groupVideosByAuthor = (
  videos: Video[]
): Record<string, Video[]> => {
  return videos.reduce((acc: Record<string, Video[]>, video) => {
    const { author } = video;
    if (!acc[author]) {
      acc[author] = [];
    }
    acc[author].push(video);
    return acc;
  }, {});
};

export const getVideoById = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  const { data, error } = await client
    .from("video_list_view")
    .select("*")
    .eq("video_id", Number(id))
    .single();
  if (error) throw new Error(error.message);
  return data;
};

