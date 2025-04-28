import { actionHelper } from '$lib/server/actionHelper';
import { usersTable } from '$lib/server/db/schema';
import { generateSession } from '$lib/server/generateSession';
import { getEmailHash } from '$lib/server/getEmailHash';
import { hashPass } from '$lib/server/hashPass';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';

export const actions = {
	new: actionHelper(
		z.object({
			email: z.string().email('Invalid Email'),
			pass1: z.string()
		}),
		async ({ email, pass1 }, { cookies, platform }) => {
			const db = drizzle(platform?.env.database);

			const emailHash = getEmailHash(email);

			const userCheck = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.emailHash, emailHash))
				.get();

			if (!userCheck) {
				return fail(400, {
					message: 'Invalid email or password'
				});
			}

			const { hash, salt } = hashPass(pass1, userCheck.salt);

			if (userCheck.hash != hash) {
				return fail(400, {
					message: 'Invalid email or password'
				});
			}

			const session = await generateSession(userCheck.id, platform);

			cookies.set('zero_session', session, {
				path: '/',
				secure: true,
				sameSite: 'strict'
			});

			return {
				message: 'success!'
			};
		}
	)
};
