import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createFeedback = async (
  client: SupabaseClient<Database>,
  { content, userId }: { content: string; userId: string }
) => {
  const { data, error } = await client
    .from("feedback")
    .insert({
      content,
      profile_id: userId,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};
