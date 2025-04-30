import { drizzle } from 'drizzle-orm/d1';
import type { Actions, PageServerLoad } from './$types';
import { authUrlTable } from '$lib/server/db/schema';
import { validateSession } from '$lib/server/validateSession';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { actionHelper } from '$lib/server/actionHelper';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

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
	},
	edit: actionHelper(
		z.object({
			oldKey: z.string(),
			newKey: z.string(),
			url: z.string()
		}),
		async ({ oldKey, newKey, url }, { cookies, platform }) => {
			const user = await validateSession(cookies, platform);
			if (!user || !user.admin) {
				throw redirect(307, '/');
			}

			const db = drizzle(platform?.env.database);
			try {
				await db
					.update(authUrlTable)
					.set({
						key: newKey,
						url: url
					})
					.where(eq(authUrlTable.key, oldKey));
			} catch (e) {
				return fail(500, {
					message: e
				});
			}

			return {
				message: 'Updated'
			};
		}
	)
} satisfies Actions;
