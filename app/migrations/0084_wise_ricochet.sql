CREATE TABLE "class_message_room_notification" (
	"class_message_room_id" bigint,
	"notification_title" text NOT NULL,
	"notification_content" text NOT NULL,
	"profile_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_message_room_notification" ADD CONSTRAINT "class_message_room_notification_class_message_room_id_class_message_rooms_class_message_room_id_fk" FOREIGN KEY ("class_message_room_id") REFERENCES "public"."class_message_rooms"("class_message_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_message_room_notification" ADD CONSTRAINT "class_message_room_notification_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;