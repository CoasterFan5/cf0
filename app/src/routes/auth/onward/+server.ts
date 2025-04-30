import { drizzle } from 'drizzle-orm/d1';
import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { authCodeTable, authUrlTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { validateSession } from '$lib/server/validateSession';
import crypto from 'crypto';
import { URL } from 'url';

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const appName = url.searchParams.get('u');
	const user = await validateSession(cookies, platform);
	if (!user) {
		throw redirect(303, `/?u=${appName}`);
	}

	if (!appName) {
		return error(400, 'No url id specified');
	}

	const db = drizzle(platform?.env.database);
	const app = await db.select().from(authUrlTable).where(eq(authUrlTable.key, appName)).get();

	const code = await db
		.insert(authCodeTable)
		.values({
			key: crypto.randomBytes(32).toString('base64url'),
			ownerId: user.id
		})
		.returning();

	if (!app) {
		return error(400, 'Invalid url id specified');
	}

	const rUrl = new URL(app.url);
	rUrl.searchParams.set('token', code[0].key);

	throw redirect(307, rUrl);
};
