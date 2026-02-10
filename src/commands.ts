import { uploadImage } from './storage';
import { logMeal, getTodayMeals, getWeeklyMeals, clearToday, addProduct, findProduct } from './database';

const [,, command, ...args] = process.argv;

switch (command) {
  case 'extract-data':
    const [imagePath] = args;
    console.log(JSON.stringify({
      action: 'NEED_AI_ANALYSIS',
      target: imagePath,
      instruction: `
Analyze this image for food components.
1. Identify individual items (e.g., "Chicken Breast", "Olive Oil").
2. Check for nutrition labels on branded products.
3. If a branded product is identified, ask the user to provide a clear photo of the nutrition label for better accuracy.
4. The user can reply with "skip" if they don't have the label, in which case you must proceed with best-effort estimates.
5. Return a JSON array of items: [{ name, brand, amount, unit, calories, protein, carbs, fat, sugar, isBranded }].
6. Also return a summary: { description, totalCalories, totalProtein, totalCarbs, totalFat }.
      `.trim()
    }, null, 2));
    break;

  case 'log':
    // Usage: bun cli.ts log "<desc>" <imgLocal> <imgRemote> '<itemsJson>'
    // itemsJson: [{"name":"Item 1", "calories":100, ...}, ...]
    const [desc, imgLocal, imgRemote, itemsJson] = args;
    const items = itemsJson ? JSON.parse(itemsJson) : [];
    uploadImage(imgLocal, imgRemote);
    logMeal(desc, imgRemote, items);
    break;

  case 'add-product':
    const [name, brand, c100, p100, cb100, f100, s100] = args;
    addProduct(name, brand, parseFloat(c100), parseFloat(p100), parseFloat(cb100), parseFloat(f100), parseFloat(s100));
    break;

  case 'find-product':
    console.log(JSON.stringify(findProduct(args[0]), null, 2));
    break;

  case 'list':
    console.log(JSON.stringify(getTodayMeals(), null, 2));
    break;

  case 'daily-analysis':
    console.log("Analyzing today's eating habits...");
    console.log(JSON.stringify({
      action: 'NEED_HABIT_ANALYSIS',
      period: 'daily',
      data: getTodayMeals()
    }, null, 2));
    break;

  case 'weekly-analysis':
    console.log("Analyzing this week's eating habits...");
    console.log(JSON.stringify({
      action: 'NEED_HABIT_ANALYSIS',
      period: 'weekly',
      data: getWeeklyMeals()
    }, null, 2));
    break;

  case 'clear':
    clearToday();
    break;

  default:
    console.log("Unknown command. Usage: bun cli.ts <extract-data|log|list|daily-analysis|weekly-analysis|clear>");
}
