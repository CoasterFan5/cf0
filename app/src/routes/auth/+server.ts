import { drizzle } from 'drizzle-orm/d1';
import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { authCodeTable, authUrlTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const appName = url.searchParams.get('u');
	if (!appName) {
		return error(400, 'No url id specified');
	}

	const db = drizzle(platform?.env.database);
	const app = await db.select().from(authUrlTable).where(eq(authUrlTable.key, appName)).get();

	if (!app) {
		return error(400, 'Invalid url id specified');
	}

	throw redirect(307, `/onward?u=appName}`);
};
