import crypto from 'crypto';
import { sessionTable } from './db/schema';
import { drizzle } from 'drizzle-orm/d1';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const generateSession = async (
	userId: number,
	platform: Readonly<App.Platform> | undefined
) => {
	const key = crypto.randomBytes(32).toString('base64url');

	const db = drizzle(platform?.env.database);

	await db.insert(sessionTable).values({
		key,
		createdAt: new Date(),
		expires: new Date(Date.now() + THIRTY_DAYS),
		ownerId: userId
	});

	return key;
};
