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
			name: z.string().min(1, 'Name must be 1 letter').max(32, 'Name can only be 32 characters'),
			email: z.string().email('Invalid Email'),
			pass1: z.string().min(8, 'Password must be > 8 characters'),
			pass2: z.string()
		}),
		async ({ name, email, pass1, pass2 }, { cookies, platform }) => {
			const db = drizzle(platform?.env.database);

			if (pass1 != pass2) {
				return fail(400, {
					message: 'Passwords must match'
				});
			}

			const emailHash = getEmailHash(email);

			const userCheck = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.emailHash, emailHash))
				.get();

			if (userCheck) {
				return fail(400, {
					message: 'Email in use'
				});
			}

			const { hash, salt } = hashPass(pass1);

			const newUser = await db
				.insert(usersTable)
				.values({
					name,
					email,
					emailHash,
					salt,
					hash
				})
				.returning();

			const session = await generateSession(newUser[0].id, platform);

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
