import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import { PAGE_SIZE } from "./constants";

export const getFeedbacks = async (
  client: SupabaseClient<Database>,
  {
    limit,
    keyword,
    page = 1,
    sorting,
  }: {
    limit: number;
    keyword?: string;
    page?: number;
    sorting: "newest" | "popular";
  }
) => {
  const baseQuery = client
    .from("feedback_list_view")
    .select(`*`)
    .limit(limit)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (sorting === "newest") {
    baseQuery.order("created_at", { ascending: false });
  } else if (sorting === "popular") {
    baseQuery.order("upvotes", { ascending: false });
  }
  if (keyword) {
    baseQuery.ilike("content", `%${keyword}%`);
  }
  const { data, error } = await baseQuery;
  if (error) throw new Error(error.message);
  return data;
};

export const getFeedbackPages = async (
  client: SupabaseClient<Database>,
  { keyword, sorting }: { keyword?: string; sorting: "newest" | "popular" }
) => {
  const baseQuery = client
    .from("feedback_list_view")
    .select(`*`, { count: "exact" });
  if (sorting === "newest") {
    baseQuery.order("created_at", { ascending: false });
  } else if (sorting === "popular") {
    baseQuery.order("upvotes", { ascending: false });
  }
  if (keyword) {
    baseQuery.ilike("content", `%${keyword}%`);
  }
  const { count, error } = await baseQuery;
  if (error) throw new Error(error.message);
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};