CREATE TYPE "public"."job_type" AS ENUM('full-time', 'part-time', 'hybrid', 'freelance', 'internship');--> statement-breakpoint
CREATE TYPE "public"."location" AS ENUM('remote', 'in-person', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."salary_range" AS ENUM('$0 - $10,000', '$10,000 - $20,000', '$20,000 - $30,000', '$30,000 - $40,000', '$40,000 - $50,000', '$50,000 - $60,000', '$60,000 - $70,000');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('developer', 'designer', 'marketer', 'founder', 'product-manager');--> statement-breakpoint
CREATE TABLE "jobs" (
	"job_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "jobs_job_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"position" text NOT NULL,
	"overview" text NOT NULL,
	"responsibilities" text NOT NULL,
	"qualifications" text NOT NULL,
	"benefits" text NOT NULL,
	"skills" text NOT NULL,
	"company_name" text NOT NULL,
	"company_logo" text NOT NULL,
	"company_location" text NOT NULL,
	"apply_url" text NOT NULL,
	"job_type" "job_type" NOT NULL,
	"location" "location" NOT NULL,
	"salary_range" "salary_range" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_id" uuid,
	"following_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"avatar" text,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"headline" text,
	"bio" text,
	"role" "role" DEFAULT 'developer' NOT NULL,
	"stats" jsonb,
	"views" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_profiles_profile_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_profiles_profile_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;