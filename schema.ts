import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // e.g. "Billa Toast Bread", "Nutella"
  brand: text('brand'), // e.g. "Billa", "Ferrero"
  caloriesPer100: real('calories_per_100').notNull(),
  proteinPer100: real('protein_per_100'),
  carbsPer100: real('carbs_per_100'),
  fatPer100: real('fat_per_100'),
  servingSize: real('serving_size'), // default unit grams/ml
  metadata: text('metadata', { mode: 'json' }), // for supermarket origin etc.
});

export const meals = sqliteTable('meals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(), // e.g. "Truffle Burger"
  category: text('category').notNull(), // e.g. "Burger"
  description: text('description'),
  totalCalories: real('total_calories').notNull(),
  totalProtein: real('total_protein'),
  totalCarbs: real('total_carbs'),
  totalFat: real('total_fat'),
  isDefinitive: integer('is_definitive', { mode: 'boolean' }).default(false), // true if package info used
});

export const mealItems = sqliteTable('meal_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mealId: integer('meal_id').references(() => meals.id),
  productId: integer('product_id').references(() => products.id),
  amount: real('amount').notNull(), // grams or units
  unit: text('unit').default('grams'),
});
