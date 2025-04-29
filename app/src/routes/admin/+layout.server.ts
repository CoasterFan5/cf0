import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, platform }) => {
	const user = await validateSession(cookies, platform);
	if (!user || !user.admin) {
		throw redirect(307, '/');
	}

	return {
		user
	};
};
