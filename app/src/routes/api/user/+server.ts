import { error, type RequestHandler } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import crypto from 'crypto';
import { authCodeTable, authTokensTable, authUrlTable, usersTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { authUid } from 'drizzle-orm/neon';

export const GET: RequestHandler = async ({ url, platform }) => {
	const db = drizzle(platform?.env?.database);

	const token = url.searchParams.get('token');

	if (!token) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid token'
			})
		);
	}

	const tokenCheck = await db
		.select()
		.from(authTokensTable)
		.leftJoin(usersTable, eq(authTokensTable.ownerId, usersTable.id))
		.where(eq(authTokensTable.key, token))
		.get();
	if (!tokenCheck) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid app token or code'
			})
		);
	}

	const user = tokenCheck.user;
	if (!user) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid app token or code'
			})
		);
	}

	return new Response(
		JSON.stringify({
			id: user.id,
			name: user.name,
			email: user.email,
			admin: user.admin
		})
	);
};
