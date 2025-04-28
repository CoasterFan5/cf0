CREATE TABLE `session` (
	`token` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`expires` integer NOT NULL
);
