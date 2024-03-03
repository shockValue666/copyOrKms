ALTER TABLE "folders" DROP CONSTRAINT "folders_folder_owner_profiles_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "folders" ADD CONSTRAINT "folders_folder_owner_users_id_fk" FOREIGN KEY ("folder_owner") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
