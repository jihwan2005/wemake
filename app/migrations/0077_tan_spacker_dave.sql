CREATE TABLE "class_message_rooms" (
	"class_message_room_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_message_rooms_class_message_room_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_message_room_members" (
	"class_message_room_id" bigint,
	"profile_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_message_room_members_class_message_room_id_profile_id_pk" PRIMARY KEY("class_message_room_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "class_message" RENAME COLUMN "message_id" TO "class_message_id";--> statement-breakpoint
ALTER TABLE "class_notifications" DROP CONSTRAINT "class_notifications_message_id_class_message_message_id_fk";
--> statement-breakpoint
ALTER TABLE "class_message" ADD COLUMN "class_message_room_id" bigint;--> statement-breakpoint
ALTER TABLE "class_message_room_members" ADD CONSTRAINT "class_message_room_members_class_message_room_id_class_message_rooms_class_message_room_id_fk" FOREIGN KEY ("class_message_room_id") REFERENCES "public"."class_message_rooms"("class_message_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_message_room_members" ADD CONSTRAINT "class_message_room_members_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_message" ADD CONSTRAINT "class_message_class_message_room_id_class_message_rooms_class_message_room_id_fk" FOREIGN KEY ("class_message_room_id") REFERENCES "public"."class_message_rooms"("class_message_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_notifications" ADD CONSTRAINT "class_notifications_message_id_class_message_class_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."class_message"("class_message_id") ON DELETE cascade ON UPDATE no action;