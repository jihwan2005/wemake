CREATE TABLE "feedback" (
	"feedback_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feedback_feedback_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"content" text NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_upvotes" (
	"feedback_id" bigint,
	"profile_id" uuid,
	CONSTRAINT "feedback_upvotes_feedback_id_profile_id_pk" PRIMARY KEY("feedback_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_upvotes" ADD CONSTRAINT "feedback_upvotes_feedback_id_feedback_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("feedback_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_upvotes" ADD CONSTRAINT "feedback_upvotes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;