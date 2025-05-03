CREATE TABLE `authCodes2` (
	`key` text PRIMARY KEY NOT NULL,
	`ownerId` integer NOT NULL,
	`urlKey` text,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`urlKey`) REFERENCES `authUrls2`(`key`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `authTokens2` (
	`key` text PRIMARY KEY NOT NULL,
	`ownerId` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `authUrls2` (
	`key` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`tokenHash` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
DROP TABLE `authCodes`;--> statement-breakpoint
DROP TABLE `authTokens`;--> statement-breakpoint
DROP TABLE `authUrls`;