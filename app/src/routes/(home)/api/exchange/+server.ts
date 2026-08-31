import { error, type RequestHandler } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import crypto from 'crypto';
import { authCodeTable, authTokensTable, authUrlTable, usersTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { authUid } from 'drizzle-orm/neon';

export const GET: RequestHandler = async ({ url, platform }) => {
	const db = drizzle(platform?.env?.database);

	const code = url.searchParams.get('code');
	const appToken = url.searchParams.get('token');

	if (!code || !appToken) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid app token or code'
			})
		);
	}

	const codeCheck = await db
		.select()
		.from(authCodeTable)
		.leftJoin(authUrlTable, eq(authCodeTable.urlKey, authUrlTable.key))
		.leftJoin(usersTable, eq(authCodeTable.ownerId, usersTable.id))
		.where(eq(authCodeTable.key, code))
		.get();
	if (!codeCheck) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid app token or code'
			})
		);
	}

	const user = codeCheck.user;
	if (!user) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid app token or code'
			})
		);
	}

	const authUrl = codeCheck.authUrls;
	if (!authUrl) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid app token or code'
			})
		);
	}

	const tokenHash = crypto.hash('sha512', appToken);
	if (tokenHash != authUrl.tokenHash) {
		return error(
			400,
			JSON.stringify({
				message: 'Invalid app token or code'
			})
		);
	}

	const newUserToken = await db
		.insert(authTokensTable)
		.values({
			key: crypto.randomBytes(128).toString('base64url'),
			ownerId: user.id
		})
		.returning();

	return new Response(
		JSON.stringify({
			token: newUserToken[0].key
		})
	);
};
