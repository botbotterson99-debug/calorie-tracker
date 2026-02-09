import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const meals = sqliteTable('meals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  imageUrl: text('image_url').notNull(),
  description: text('description').notNull(),
  calories: integer('calories').notNull(),
  nutrients: text('nutrients', { mode: 'json' }), // Optional JSON for macros
});
