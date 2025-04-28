import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	email: text().notNull(),
	emailHash: text().notNull(), // A field of the email trimmed, lowered, and hashed
	salt: text().notNull(),
	hash: text().notNull()
});

export const sessionTable = sqliteTable('session', {
	key: text().primaryKey(),
	createdAt: integer({ mode: 'timestamp' }).notNull(),
	expires: integer({ mode: 'timestamp' }).notNull(),
	ownerId: integer()
		.notNull()
		.references(() => usersTable.id)
});
