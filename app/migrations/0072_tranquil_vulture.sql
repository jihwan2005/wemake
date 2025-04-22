ALTER TABLE "class_message" RENAME COLUMN "sender_id" TO "sender";--> statement-breakpoint
ALTER TABLE "class_message" RENAME COLUMN "receiver_id" TO "receiver";--> statement-breakpoint
ALTER TABLE "class_message" DROP CONSTRAINT "class_message_sender_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "class_message" DROP CONSTRAINT "class_message_receiver_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "class_message" ADD CONSTRAINT "class_message_sender_profiles_profile_id_fk" FOREIGN KEY ("sender") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_message" ADD CONSTRAINT "class_message_receiver_profiles_profile_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;