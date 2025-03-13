import client from "~/supa-client";
import { PAGE_SIZE } from "./constants";

export const getJobs = async ({
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
}) => {
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
    baseQuery.eq("location", location);
  }
  if (type) {
    baseQuery.eq("job_type", type);
  }
  if (salary) {
    baseQuery.eq("salary_range", salary);
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

export const getJobsPages = async ({
  location,
  type,
  salary,
  keyword,
}: {
  location?: string;
  type?: string;
  salary?: string;
  keyword?: string;
}) => {
  const baseQuery = client.from("jobs").select("*", { count: "exact" });
  if (location) {
    baseQuery.eq("location", location);
  }
  if (type) {
    baseQuery.eq("job_type", type);
  }
  if (salary) {
    baseQuery.eq("salary_range", salary);
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

export const getJobById = async (jobId: string) => {
  const { data, error } = await client
    .from("jobs")
    .select("*")
    .eq("job_id", jobId)
    .single();
  if (error) {
    throw error;
  }
  return data;
};
