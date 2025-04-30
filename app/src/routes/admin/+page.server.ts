import { drizzle } from 'drizzle-orm/d1';
import type { Actions, PageServerLoad } from './$types';
import { authUrlTable } from '$lib/server/db/schema';
import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import crypto from 'crypto';

export const load: PageServerLoad = async ({ platform }) => {
	const db = drizzle(platform?.env.database);

	const authUrls = await db.select().from(authUrlTable);

	return {
		authUrls
	};
};

export const actions = {
	new: async ({ cookies, platform }) => {
		const user = await validateSession(cookies, platform);
		if (!user || !user.admin) {
			throw redirect(307, '/');
		}

		const db = drizzle(platform?.env.database);
		await db.insert(authUrlTable).values({
			key: crypto.randomBytes(8).toString('base64url'),
			url: 'http://localhost:5173/auth'
		});
	}
} satisfies Actions;
