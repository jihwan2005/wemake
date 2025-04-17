CREATE TABLE "checked_goal" (
	"goal_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	CONSTRAINT "checked_goal_goal_id_profile_id_pk" PRIMARY KEY("goal_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "checked_goal" ADD CONSTRAINT "checked_goal_goal_id_class_goals_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."class_goals"("goal_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checked_goal" ADD CONSTRAINT "checked_goal_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;