import { PAGE_SIZE } from "./constants";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getGptIdeas = async (
  client: SupabaseClient<Database>,
  {
    limit,
    keyword,
    page = 1,
  }: {
    limit: number;
    keyword?: string;
    page?: number;
  }
) => {
  const baseQuery = client
    .from("gpt_ideas_view")
    .select(`*`)
    .limit(limit)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (keyword) {
    baseQuery.ilike("idea", `%${keyword}%`);
  }
  const { data, error } = await baseQuery;
  if (error) throw new Error(error.message);
  return data;
};

export const getGptIdea = async (
  client: SupabaseClient<Database>,
  { ideaId }: { ideaId: string }
) => {
  const { data, error } = await client
    .from("gpt_ideas_view")
    .select("*")
    .eq("gpt_idea_id", Number(ideaId))
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getGptIdeaPages = async (
  client: SupabaseClient<Database>,
  { keyword }: { keyword?: string }
) => {
  const baseQuery = client
    .from("gpt_ideas_view")
    .select(`*`, { count: "exact" });
  if (keyword) {
    baseQuery.ilike("idea", `%${keyword}%`);
  }
  const { count, error } = await baseQuery;
  if (error) throw new Error(error.message);
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};
