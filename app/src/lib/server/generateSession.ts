import crypto from 'crypto';
import { db } from './db';
import { sessionTable } from './db/schema';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const generateSession = async (userId: number) => {
	const key = crypto.randomBytes(32).toString('base64url');

	await db.insert(sessionTable).values({
		key,
		createdAt: new Date(),
		expires: new Date(Date.now() + THIRTY_DAYS),
		ownerId: userId
	});

	return key;
};
