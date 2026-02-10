import { execSync } from 'child_process';
import { resolve } from 'path';

const PROJECT_DIR = resolve(__dirname, '..');
const CONFIG = resolve(PROJECT_DIR, 'wrangler.json');

export type Nutrients = {
  protein?: number;
  carbs?: number;
  fat?: number;
};

export function logMeal(description: string, imageUrl: string, items: any[] = []) {
  console.log(`Logging meal: ${description}...`);
  
  // 1. Insert Meal
  const mealSql = `INSERT INTO meals (timestamp, image_url, name, category, description) VALUES (strftime('%s','now'), '${imageUrl}', '${description}', 'General', '${description}') RETURNING id;`;
  
  const result = execSync(
    `npx wrangler d1 execute calorie-tracker-db --local --command="${mealSql}" --config ${CONFIG} --json`,
    { encoding: 'utf8' }
  );
  
  const mealId = JSON.parse(result)[0].results[0].id;
  console.log(`Meal logged with ID: ${mealId}`);

  // 2. Insert Items
  for (const item of items) {
    console.log(`Linking item: ${item.name || 'Unknown Product'}...`);
    // Ensure all required numeric fields are present
    const cals = item.calories || 0;
    const protein = item.protein || 0;
    const carbs = item.carbs || 0;
    const fat = item.fat || 0;
    const productId = item.productId || 'NULL';
    const amount = item.amount || 1;
    const unit = item.unit || 'grams';
    
    const itemSql = `INSERT INTO meal_items (meal_id, product_id, name, amount, unit, calories, protein, carbs, fat) VALUES (${mealId}, ${productId}, '${item.name}', ${amount}, '${unit}', ${cals}, ${protein}, ${carbs}, ${fat});`;
    execSync(`npx wrangler d1 execute calorie-tracker-db --local --command="${itemSql}" --config ${CONFIG}`, { stdio: 'ignore' });
  }
}

export function addProduct(name: string, brand: string, cals100: number, p100: number, c100: number, f100: number) {
  const sql = `INSERT INTO products (name, brand, calories_per_100, protein_per_100, carbs_per_100, fat_per_100) VALUES ('${name}', '${brand}', ${cals100}, ${p100}, ${c100}, ${f100});`;
  execSync(`npx wrangler d1 execute calorie-tracker-db --local --command="${sql}" --config ${CONFIG}`, { stdio: 'inherit' });
}

export function findProduct(name: string) {
  const sql = `SELECT * FROM products WHERE name LIKE '%${name}%' OR brand LIKE '%${name}%';`;
  const result = execSync(`npx wrangler d1 execute calorie-tracker-db --local --command="${sql}" --config ${CONFIG} --json`, { encoding: 'utf8' });
  return JSON.parse(result)[0].results;
}

export function getTodayMeals() {
  const sql = `
    SELECT 
      m.id,
      m.description, 
      datetime(m.timestamp, 'unixepoch') as time,
      SUM(mi.calories) as calories,
      SUM(mi.protein) as protein,
      SUM(mi.carbs) as carbs,
      SUM(mi.fat) as fat
    FROM meals m
    JOIN meal_items mi ON m.id = mi.meal_id
    WHERE date(m.timestamp, 'unixepoch') = date('now')
    GROUP BY m.id;
  `;
  const result = execSync(
    `npx wrangler d1 execute calorie-tracker-db --local --command="${sql}" --config ${CONFIG} --json`,
    { encoding: 'utf8' }
  );
  return JSON.parse(result)[0].results;
}

export function getWeeklyMeals() {
  const sql = `
    SELECT 
      m.id,
      m.description, 
      datetime(m.timestamp, 'unixepoch') as time,
      SUM(mi.calories) as calories,
      SUM(mi.protein) as protein,
      SUM(mi.carbs) as carbs,
      SUM(mi.fat) as fat
    FROM meals m
    JOIN meal_items mi ON m.id = mi.meal_id
    WHERE m.timestamp >= strftime('%s', 'now', '-7 days')
    GROUP BY m.id;
  `;
  const result = execSync(
    `npx wrangler d1 execute calorie-tracker-db --local --command="${sql}" --config ${CONFIG} --json`,
    { encoding: 'utf8' }
  );
  return JSON.parse(result)[0].results;
}

export function clearToday() {
  console.log("Clearing today's logs...");
  // Use a subquery to delete related meal_items first if necessary, 
  // though D1 with local sqlite might not enforce FKs unless enabled.
  // Better yet, just delete both.
  const deleteItems = `DELETE FROM meal_items WHERE meal_id IN (SELECT id FROM meals WHERE date(timestamp, 'unixepoch') = date('now'));`;
  const deleteMeals = `DELETE FROM meals WHERE date(timestamp, 'unixepoch') = date('now');`;
  
  execSync(`npx wrangler d1 execute calorie-tracker-db --local --command="${deleteItems}" --config ${CONFIG}`, { stdio: 'inherit' });
  execSync(`npx wrangler d1 execute calorie-tracker-db --local --command="${deleteMeals}" --config ${CONFIG}`, { stdio: 'inherit' });
}
