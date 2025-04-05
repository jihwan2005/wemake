ALTER TABLE "videos_replies" DROP CONSTRAINT "videos_replies_parent_id_videos_replies_video_reply_id_fk";
--> statement-breakpoint
ALTER TABLE "videos_replies" DROP COLUMN "parent_id";