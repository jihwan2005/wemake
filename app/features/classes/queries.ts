import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getClasses = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("class_list_view").select("*");
  if (error) throw error;
  return data;
};

export const getClassHashTags = async (client: SupabaseClient<Database>) => {};
