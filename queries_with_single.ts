import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

// Function from app/features/teams/queries.ts
export const getTeamById = async (
  client: SupabaseClient<Database>,
  { teamId }: { teamId: string }
) => {
  const { data, error } = await client
    .from("teams")
    .select(
      `
      *,
      team_leader:profiles!inner(
        name,
        avatar,
        role
      )
      `
    )
    .eq("team_id", Number(teamId))
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Function from app/features/auth/queries.ts
export const checkUsernameExists = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  const { data, error } = await client
    .from("profiles")
    .select("profile_id")
    .eq("username", username)
    .single();
  if (error) {
    return false;
  }
  return true;
};

// Function from app/features/users/queries.ts
export const getUserProfile = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
      profile_id,
      name,
      username,
      avatar,
      role,
      headline,
      bio
      `
    )
    .eq("username", username)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const getUserById = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
      profile_id,
      name,
      username,
      avatar
      `
    )
    .eq("profile_id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

// Function from app/features/products/queries.ts
export const getProductById = async (
  client: SupabaseClient<Database>,
  { productId }: { productId: string }
) => {
  const { data, error } = await client
    .from("product_overview_view")
    .select("*")
    .eq("product_id", Number(productId))
    .single();
  if (error) throw error;
  return data;
};

// Function from app/features/community/queries.ts
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
