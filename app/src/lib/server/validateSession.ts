import crypto from 'crypto';
import { sessionTable, usersTable } from './db/schema';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const validateSession = async (
	cookies: Cookies,
	platform: Readonly<App.Platform> | undefined
) => {
	const db = drizzle(platform?.env.database);

	const session = cookies.get('zero_session');

	if (!session) {
		return false;
	}

	const ses = await db
		.select()
		.from(sessionTable)
		.leftJoin(usersTable, eq(sessionTable.ownerId, usersTable.id))
		.where(eq(sessionTable.key, session))
		.get();

	if (!ses?.user) {
		return false;
	}

	return ses.user;
};
