import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const appName = url.searchParams.get('u');
	if (!appName) {
		return error(400, 'No url id specified');
	}

	return new Response(`<meta http-equiv="refresh" content="0; url=/auth/onward?u=${appName}" />`, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8'
		}
	});
};
