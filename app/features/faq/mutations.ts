import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createFaq = async (
  client: SupabaseClient<Database>,
  { question, userId }: { question: string; userId: string }
) => {
  const { data, error } = await client
    .from("faq")
    .insert({
      question,
      profile_id: userId,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};
