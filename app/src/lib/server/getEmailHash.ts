import crypto from 'crypto';

export const getEmailHash = (email: string) => {
	const newEmail = email.toLowerCase().trim();

	const hash = crypto.hash('sha256', newEmail);

	return hash;
};
