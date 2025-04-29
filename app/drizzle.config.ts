import { defineConfig } from 'drizzle-kit';

import { env } from 'cloudflare:workers';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	verbose: true,
	strict: true,
	dialect: 'sqlite'
});
