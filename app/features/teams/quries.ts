import client from "~/supa-client";
import { PAGE_SIZE } from "./constants";
import { data } from "react-router";

export const getTeams = async ({
  limit,
  page = 1,
  keyword,
}: {
  limit: number;
  page?: number;
  keyword?: string;
}) => {
  const baseQuery = client
    .from("teams")
    .select(
      `
    team_id,
    roles,
    product_description,
    team_leader:profiles!inner(
      username,
      avatar
    )
    `
    )
    .limit(limit)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (keyword) {
    baseQuery.ilike("roles", `%${keyword}%`);
  }
  const { data, error } = await baseQuery;
  if (error) throw new Error(error.message);
  return data;
};

export const getTeamsPages = async ({ keyword }: { keyword?: string }) => {
  const baseQuery = client.from("teams").select("*", { count: "exact" });
  if (keyword) {
    baseQuery.ilike("roles", `%${keyword}%`);
  }
  const { count, error } = await baseQuery;
  if (error) throw new Error(error.message);

  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};

export const getTeamById = async (teamId: string) => {
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
    .eq("team_id", teamId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
