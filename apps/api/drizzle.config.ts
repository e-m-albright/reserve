import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  // For local development, use SQLite file
  // Wrangler creates local D1 database at .wrangler/state/v3/d1/
  dbCredentials: {
    url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/reserve.sqlite',
  },
  // For Cloudflare D1 production, uncomment and use:
  // driver: 'd1-http',
  // dbCredentials: {
  //   accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  //   databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
  //   token: process.env.CLOUDFLARE_API_TOKEN!,
  // },
});
