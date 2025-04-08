CREATE TABLE "classPost_with_hashtags" (
	"class_post_id" bigint NOT NULL,
	"hashtag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hashtags" (
	"hashtag_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "hashtags_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
ALTER TABLE "classPost_with_hashtags" ADD CONSTRAINT "classPost_with_hashtags_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classPost_with_hashtags" ADD CONSTRAINT "classPost_with_hashtags_hashtag_id_hashtags_hashtag_id_fk" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtags"("hashtag_id") ON DELETE cascade ON UPDATE no action;