import crypto from 'crypto';

export const hashPass = (pass: string, salt?: string) => {
	if (!salt) {
		salt = crypto.randomBytes(32).toString('base64url');
	}

	const hash = crypto.pbkdf2Sync(pass, salt, 1000, 128, 'sha256').toString('base64url');

	return { hash, salt };
};
