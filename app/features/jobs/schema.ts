import { bigint, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { JOB_TYPES, LOCATION_TYPES, SALARY_TYPES } from "./constants";

export const jobTypes = pgEnum(
  "job_type",
  JOB_TYPES.map((type) => type.value) as [string, ...string[]]
);

export const locations = pgEnum(
  "location",
  LOCATION_TYPES.map((type) => type.value) as [string, ...string[]]
);

export const salaryRanges = pgEnum("salary_range", SALARY_TYPES);

export const jobs = pgTable("jobs", {
  job_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  position: text().notNull(),
  overview: text().notNull(),
  responsibilities: text().notNull(),
  qualifications: text().notNull(),
  benefits: text().notNull(),
  skills: text().notNull(),
  company_name: text().notNull(),
  company_logo: text().notNull(),
  company_location: text().notNull(),
  apply_url: text().notNull(),
  job_type: jobTypes().notNull(),
  location: locations().notNull(),
  salary_range: salaryRanges().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
