import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/7069af24-bf8f-4842-afdf-a33a73e203fd.sqlite',
  },
});
