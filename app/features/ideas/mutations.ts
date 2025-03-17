import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const claimIdea = async (
  client: SupabaseClient<Database>,
  { ideaId, userId }: { ideaId: string; userId: string }
) => {
  const { error } = await client
    .from("gpt_ideas")
    .update({ claimed_by: userId, claimed_at: new Date().toISOString() })
    .eq("gpt_idea_id", Number(ideaId));
  if (error) {
    throw error;
  }
};
