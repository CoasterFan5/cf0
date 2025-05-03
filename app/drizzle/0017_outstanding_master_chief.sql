CREATE TABLE `authCodes` (
	`key` text PRIMARY KEY NOT NULL,
	`ownerId` integer NOT NULL,
	`urlKey` text NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`urlKey`) REFERENCES `authUrls`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `authTokens` (
	`key` text PRIMARY KEY NOT NULL,
	`ownerId` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `authUrls` (
	`key` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`tokenHash` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
DROP TABLE `authCodes2`;--> statement-breakpoint
DROP TABLE `authTokens2`;--> statement-breakpoint
DROP TABLE `authUrls2`;