import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	email: text().notNull(),
	emailHash: text().notNull(), // A field of the email trimmed, lowered, and hashed
	salt: text().notNull(),
	hash: text().notNull(),
	admin: integer({ mode: 'boolean' }).notNull().default(false)
});

export const sessionTable = sqliteTable('session', {
	key: text().primaryKey(),
	createdAt: integer({ mode: 'timestamp' }).notNull(),
	expires: integer({ mode: 'timestamp' }).notNull(),
	ownerId: integer()
		.notNull()
		.references(() => usersTable.id)
});

export const authUrlTable = sqliteTable('authUrls', {
	key: text().primaryKey(),
	url: text().notNull(),
	tokenHash: text().notNull().default('')
});

export const authCodeTable = sqliteTable('authCodes', {
	key: text().primaryKey(),
	ownerId: integer()
		.notNull()
		.references(() => usersTable.id),
	urlKey: text()
		.notNull()
		.references(() => authUrlTable.key)
});

export const authTokensTable = sqliteTable('authTokens', {
	key: text().primaryKey(),
	ownerId: integer()
		.notNull()
		.references(() => usersTable.id)
});
