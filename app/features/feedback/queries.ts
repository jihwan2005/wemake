import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getFeedbacks = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("feedback_list_view").select(`*`);
  if (error) throw new Error(error.message);
  return data;
};
