import { actionHelper } from '$lib/server/actionHelper';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

export const actions = {
	new: actionHelper(
		z.object({
			name: z.string().min(1, 'Name must be 1 letter').max(32, 'Name can only be 32 characters'),
			email: z.string().email('Invalid Email'),
			pass1: z.string(),
			pass2: z.string()
		}),
		async ({ name, email, pass1, pass2 }, {}) => {
			if (pass1 != pass2) {
				return fail(400, {
					message: 'Passwords must match'
				});
			}

			return {
				message: 'success!'
			};
		}
	)
};
