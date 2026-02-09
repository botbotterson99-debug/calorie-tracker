import { drizzle } from 'drizzle-orm/d1';
import { meals } from './schema';
import { desc, gte, sql } from 'drizzle-orm';

export async function getDailyAnalytics(db: any) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const results = await db
    .select({
      totalCalories: sql<number>`sum(${meals.calories})`,
      avgCalories: sql<number>`avg(${meals.calories})`,
      count: sql<number>`count(*)`,
    })
    .from(meals)
    .where(gte(meals.timestamp, startOfDay))
    .all();

  return results[0];
}

export async function getWeeklyAnalytics(db: any) {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const results = await db
    .select({
      totalCalories: sql<number>`sum(${meals.calories})`,
      avgCalories: sql<number>`avg(${meals.calories})`,
      count: sql<number>`count(*)`,
    })
    .from(meals)
    .where(gte(meals.timestamp, startOfWeek))
    .all();

  return results[0];
}

export async function getLatestMeals(db: any, limit = 5) {
  return await db.select().from(meals).orderBy(desc(meals.timestamp)).limit(limit).all();
}
