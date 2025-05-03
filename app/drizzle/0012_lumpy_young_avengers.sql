CREATE TABLE `authTokens` (
	`key` text PRIMARY KEY NOT NULL,
	`ownerId` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `authCodes` ADD `urlKey` text REFERENCES apps(key);
