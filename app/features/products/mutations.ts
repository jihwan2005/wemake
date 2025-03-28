import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createProductReview = async (
  client: SupabaseClient<Database>,
  {
    productId,
    review,
    rating,
    userId,
  }: { productId: string; review: string; rating: number; userId: string }
) => {
  const { error } = await client.from("reviews").insert({
    product_id: +productId,
    review,
    rating,
    profile_id: userId,
  });
  if (error) {
    throw error;
  }
};

export const createProduct = async (
  client: SupabaseClient<Database>,
  {
    name,
    tagline,
    description,
    howItWorks,
    url,
    iconUrl,
    categoryId,
    userId,
  }: {
    name: string;
    tagline: string;
    description: string;
    howItWorks: string;
    url: string;
    iconUrl: string;
    categoryId: number;
    userId: string;
  }
) => {
  const { data, error } = await client
    .from("products")
    .insert({
      name,
      tagline,
      description,
      how_it_works: howItWorks,
      url,
      icon: iconUrl,
      category_id: categoryId,
      profile_id: userId,
    })
    .select("product_id")
    .single();
  if (error) throw error;
  return data.product_id;
};

export const createVotePost = async (
  client: SupabaseClient<Database>,
  {
    title,
    content,
    optionTexts,
    userId,
  }: {
    title: string;
    content: string;
    optionTexts: string[];
    userId: string;
  }
) => {
  const { data, error } = await client
    .from("vote_posts")
    .insert({
      title,
      content,
      profile_id: userId,
    })
    .select("vote_post_id")
    .single();
  if (error) {
    console.error("Error inserting vote post:", error);
    throw error;
  }
  const votePostId = data.vote_post_id;
  try {
    await Promise.all(
      optionTexts.map(async (optionText) => {
        const { error: optionError } = await client
          .from("vote_options")
          .insert({
            vote_post_id: votePostId,
            option_text: optionText,
          });
        if (optionError) throw optionError;
      })
    );
  } catch (optionInsertError) {
    await client.from("vote_posts").delete().eq("vote_post_id", votePostId);
    throw optionInsertError;
  }
  return { post_id: votePostId };
};

