import { productListSelect } from "../products/queries";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import { redirect } from "react-router";
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
        avatar,
        headline,
        bio,
        role
        `
    )
    .eq("profile_id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const getUserProducts = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  const { data, error } = await client
    .from("products")
    .select(
      `
        ${productListSelect},
        profiles!products_to_profiles!inner (
            profile_id
        )
    `
    )
    .eq("profiles.username", username);
  if (error) {
    throw error;
  }
  return data;
};

export const getUserPosts = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  const { data, error } = await client
    .from("community_post_list_view")
    .select("*")
    .eq("author_username", username);
  if (error) {
    throw error;
  }
  return data;
};

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) {
    throw redirect("/auth/login");
  }
  return data.user.id;
};

export const getNotifications = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("notifications")
    .select(
      `
      notification_id,
      type,
      source:profiles!source_id(
        profile_id,
        name,
        avatar
      ),
      product:products!product_id(
        product_id,
        name
      ),
      post:posts!post_id(
        post_id,
        title
      ),
      seen,
      created_at
      `
    )
    .eq("target_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const countNotifications = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { count, error } = await client
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("seen", false)
    .eq("target_id", userId);
  if (error) {
    throw error;
  }
  return count ?? 0;
};

export const getMessages = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("messages_view")
    .select("*")
    .eq("profile_id", userId)
    .neq("other_profile_id", userId);
  if (error) {
    throw error;
  }
  return data;
};

export const getMessagesByMessagesRoomId = async (
  client: SupabaseClient<Database>,
  { messageRoomId, userId }: { messageRoomId: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { data, error } = await client
    .from("messages")
    .select(
      `*,
        created_at
      `
    )
    .eq("message_room_id", Number(messageRoomId))
    .order("created_at", { ascending: true });
  if (error) {
    throw error;
  }
  return data;
};

export const getRoomsParticipant = async (
  client: SupabaseClient<Database>,
  { messageRoomId, userId }: { messageRoomId: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { data, error } = await client
    .from("message_room_members")
    .select(
      `
      profile:profiles!profile_id!inner(
        name,
        profile_id,
        avatar
      )
      `
    )
    .eq("message_room_id", Number(messageRoomId))
    .neq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const sendMessageToRoom = async (
  client: SupabaseClient<Database>,
  {
    messageRoomId,
    message,
    userId,
  }: { messageRoomId: string; message: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { error } = await client.from("messages").insert({
    content: message,
    message_room_id: Number(messageRoomId),
    sender_id: userId,
  });
  if (error) {
    throw error;
  }
};