ALTER TABLE "class_message" DROP CONSTRAINT "class_message_receiver_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "class_message" DROP COLUMN "receiver";