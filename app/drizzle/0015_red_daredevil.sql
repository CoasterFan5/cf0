ALTER TABLE `apps` RENAME TO `authUrls`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authCodes` (
	`key` text PRIMARY KEY NOT NULL,
	`ownerId` integer NOT NULL,
	`urlKey` text,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`urlKey`) REFERENCES `authUrls`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_authCodes`("key", "ownerId", "urlKey") SELECT "key", "ownerId", "urlKey" FROM `authCodes`;--> statement-breakpoint
DROP TABLE `authCodes`;--> statement-breakpoint
ALTER TABLE `__new_authCodes` RENAME TO `authCodes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;