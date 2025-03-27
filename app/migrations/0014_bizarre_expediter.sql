CREATE TABLE "user_votes" (
	"vote_post_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"vote_option_id" bigint NOT NULL,
	"voted_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_votes_vote_post_id_profile_id_pk" PRIMARY KEY("vote_post_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "vote_options" (
	"vote_option_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vote_options_vote_option_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"vote_post_id" bigint NOT NULL,
	"option_text" text NOT NULL,
	"vote_count" bigint DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "vote_posts" (
	"vote_post_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vote_posts_vote_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"post_id" bigint NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"profile_id" uuid NOT NULL,
	"upvotes" bigint DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "message_room_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "sender_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_votes" ADD CONSTRAINT "user_votes_vote_post_id_vote_posts_vote_post_id_fk" FOREIGN KEY ("vote_post_id") REFERENCES "public"."vote_posts"("vote_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_votes" ADD CONSTRAINT "user_votes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_votes" ADD CONSTRAINT "user_votes_vote_option_id_vote_options_vote_option_id_fk" FOREIGN KEY ("vote_option_id") REFERENCES "public"."vote_options"("vote_option_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_options" ADD CONSTRAINT "vote_options_vote_post_id_vote_posts_vote_post_id_fk" FOREIGN KEY ("vote_post_id") REFERENCES "public"."vote_posts"("vote_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_posts" ADD CONSTRAINT "vote_posts_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_posts" ADD CONSTRAINT "vote_posts_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;