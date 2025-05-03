PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authTokens` (
	`key` text PRIMARY KEY NOT NULL,
	`ownerId` integer,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_authTokens`("key", "ownerId") SELECT "key", "ownerId" FROM `authTokens`;--> statement-breakpoint
DROP TABLE `authTokens`;--> statement-breakpoint
ALTER TABLE `__new_authTokens` RENAME TO `authTokens`;--> statement-breakpoint
PRAGMA foreign_keys=ON;