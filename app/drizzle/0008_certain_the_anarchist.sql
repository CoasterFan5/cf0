PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_apps` (
	`key` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_apps`("key", "url") SELECT "key", "url" FROM `apps`;--> statement-breakpoint
DROP TABLE `apps`;--> statement-breakpoint
ALTER TABLE `__new_apps` RENAME TO `apps`;--> statement-breakpoint
PRAGMA foreign_keys=ON;