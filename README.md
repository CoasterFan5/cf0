# CF0
My auth platform

## Managing DB Migrations
Create a migration with drizzle:
```bash
npx drizzle-kit generate
```

Apply with wrangler
```bash
npx wrangler d1 migrate database --local
```
