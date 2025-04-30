import { drizzle } from 'drizzle-orm/d1';
import type { Actions, PageServerLoad } from './$types';
import { authUrlTable } from '$lib/server/db/schema';
import { validateSession } from '$lib/server/validateSession';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { actionHelper } from '$lib/server/actionHelper';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { authUid } from 'drizzle-orm/supabase';

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

			if (oldKey != newKey) {
				const keyTest = await db
					.select()
					.from(authUrlTable)
					.where(eq(authUrlTable.key, newKey))
					.get();
				if (keyTest) {
					return fail(400, {
						message: 'Duplicate Key'
					});
				}
			}

			try {
				const updated = await db
					.update(authUrlTable)
					.set({
						key: newKey,
						url: url
					})
					.where(eq(authUrlTable.key, oldKey))
					.returning();
				return {
					message: 'Updated',
					key: updated[0].key,
					url: updated[0].url
				};
			} catch (e) {
				return fail(500, {
					message: 'Erorr updating'
				});
			}
		}
	),
	roll: actionHelper(
		z.object({
			key: z.string()
		}),
		async ({ key }, { cookies, platform }) => {
			const user = await validateSession(cookies, platform);
			if (!user || !user.admin) {
				throw redirect(307, '/');
			}

			const db = drizzle(platform?.env.database);
			const check = await db.select().from(authUrlTable).where(eq(authUrlTable.key, key)).get();
			if (!check) {
				return fail(400, {
					message: 'Does not exist'
				});
			}

			const newToken = crypto.randomBytes(32).toString('base64url');
			const hash = crypto.hash('sha512', newToken);

			await db
				.update(authUrlTable)
				.set({
					tokenHash: hash
				})
				.where(eq(authUrlTable.key, key));

			return {
				message: 'Api Token Rolled',
				newToken
			};
		}
	),
	delete: actionHelper(
		z.object({
			key: z.string()
		}),
		async ({ key }, { cookies, platform }) => {
			const user = await validateSession(cookies, platform);
			if (!user || !user.admin) {
				throw redirect(307, '/');
			}

			const db = drizzle(platform?.env.database);
			const check = await db.select().from(authUrlTable).where(eq(authUrlTable.key, key)).get();
			if (!check) {
				return fail(400, {
					message: 'Does not exist'
				});
			}

			await db.delete(authUrlTable).where(eq(authUrlTable.key, key));

			return {
				message: 'Removed.'
			};
		}
	)
} satisfies Actions;
