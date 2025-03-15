import { PAGE_SIZE } from "./constants";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getJobs = async (
  client: SupabaseClient<Database>,
  {
    limit,
    location,
    type,
    salary,
    page = 1,
    keyword,
  }: {
    limit: number;
    location?: string;
    type?: string;
    salary?: string;
    page?: number;
    keyword?: string;
  }
) => {
  const baseQuery = client
    .from("jobs")
    .select(
      `
    job_id,
    position,
    overview,
    company_name,
    company_logo,
    company_location,
    job_type,
    location,
    salary_range,
    created_at
    `
    )
    .limit(limit)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (location) {
    baseQuery.eq(
      "location",
      location as NonNullable<
        Database["public"]["Tables"]["jobs"]["Row"]["location"]
      >
    );
  }
  if (type) {
    baseQuery.eq(
      "job_type",
      type as NonNullable<
        Database["public"]["Tables"]["jobs"]["Row"]["job_type"]
      >
    );
  }
  if (salary) {
    baseQuery.eq(
      "salary_range",
      salary as NonNullable<
        Database["public"]["Tables"]["jobs"]["Row"]["salary_range"]
      >
    );
  }

  if (keyword) {
    baseQuery.ilike("position", `%${keyword}%`);
  }
  const { data, error } = await baseQuery;
  if (error) {
    throw error;
  }
  return data;
};

export const getJobsPages = async (
  client: SupabaseClient<Database>,
  {
    location,
    type,
    salary,
    keyword,
  }: {
    location?: string;
    type?: string;
    salary?: string;
    keyword?: string;
  }
) => {
  const baseQuery = client.from("jobs").select("*", { count: "exact" });
  if (location) {
    baseQuery.eq(
      "location",
      location as NonNullable<
        Database["public"]["Tables"]["jobs"]["Row"]["location"]
      >
    );
  }
  if (type) {
    baseQuery.eq(
      "job_type",
      type as NonNullable<
        Database["public"]["Tables"]["jobs"]["Row"]["job_type"]
      >
    );
  }
  if (salary) {
    baseQuery.eq(
      "salary_range",
      salary as NonNullable<
        Database["public"]["Tables"]["jobs"]["Row"]["salary_range"]
      >
    );
  }
  if (keyword) {
    baseQuery.ilike("position", `%${keyword}%`);
  }
  const { count, error } = await baseQuery;
  if (error) {
    throw error;
  }
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};

export const getJobById = async (
  client: SupabaseClient<Database>,
  { jobId }: { jobId: string }
) => {
  const { data, error } = await client
    .from("jobs")
    .select("*")
    .eq("job_id", Number(jobId))
    .single();
  if (error) {
    throw error;
  }
  return data;
};
