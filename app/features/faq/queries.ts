import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import { PAGE_SIZE } from "./constants";

export const getFaq = async (
  client: SupabaseClient<Database>,
  {
    keyword,
    page = 1,
    limit,
  }: { keyword?: string; limit: number; page?: number }
) => {
  const baseQuery = client
    .from("faq_list_view")
    .select(`*`)
    .limit(limit)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .order("created_at", { ascending: false });
  if (keyword) {
    baseQuery.ilike("question", `%${keyword}%`);
  }
  const { data, error } = await baseQuery;
  if (error) throw new Error(error.message);
  return data;
};

export const getFaqPages = async (
  client: SupabaseClient<Database>,
  { keyword }: { keyword?: string }
) => {
  const baseQuery = client
    .from("feedback_list_view")
    .select(`*`, { count: "exact" })
    .order("created_at", { ascending: false });
  if (keyword) {
    baseQuery.ilike("content", `%${keyword}%`);
  }
  const { count, error } = await baseQuery;
  if (error) throw new Error(error.message);
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};
