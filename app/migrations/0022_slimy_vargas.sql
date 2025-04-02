CREATE TABLE "videos_replies" (
	"video_reply_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "videos_replies_video_reply_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"video_id" bigint,
	"parent_id" bigint,
	"profile_id" uuid NOT NULL,
	"reply" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos_upvotes" (
	"video_id" bigint,
	"profile_id" uuid,
	CONSTRAINT "videos_upvotes_video_id_profile_id_pk" PRIMARY KEY("video_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"video_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "videos_video_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" text,
	"description" text,
	"video_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"profile_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos_replies" ADD CONSTRAINT "videos_replies_video_id_videos_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("video_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos_replies" ADD CONSTRAINT "videos_replies_parent_id_videos_replies_video_reply_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."videos_replies"("video_reply_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos_replies" ADD CONSTRAINT "videos_replies_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos_upvotes" ADD CONSTRAINT "videos_upvotes_video_id_videos_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("video_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos_upvotes" ADD CONSTRAINT "videos_upvotes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;