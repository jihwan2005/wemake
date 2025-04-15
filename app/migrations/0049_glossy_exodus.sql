/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'bookmarked_lesson'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "bookmarked_lesson" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "bookmarked_lesson" ALTER COLUMN "lesson_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bookmarked_lesson" ADD CONSTRAINT "bookmarked_lesson_lesson_id_profile_id_pk" PRIMARY KEY("lesson_id","profile_id");