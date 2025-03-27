ALTER TABLE "vote_posts" DROP CONSTRAINT "vote_posts_post_id_posts_post_id_fk";
--> statement-breakpoint
ALTER TABLE "vote_posts" DROP COLUMN "post_id";