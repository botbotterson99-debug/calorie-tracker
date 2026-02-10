# Calorie Tracker

Personal nutrition tracking app.

## Project Structure
- `schema.ts`: Database schema (D1/Drizzle).
- `cli.ts`: Administrative CLI for logging and management.

## Usage (CLI)

Use `bun cli.ts` to interact with the project:

### 1. Extract Data
Prepares a structured request for AI analysis of a meal image.

**Analyze-then-Log Flow:**
1. Run `extract-data`.
2. AI identifies components.
3. **If branded products are found:** The AI agent MUST ask the user for a nutrition label photo.
4. User provides photo or says "skip".
5. AI proceeds with final macros (estimated or definitive).

```bash
bun cli.ts extract-data <local_image_path>
```

### 2. Log a Meal
Persists the meal to D1 and uploads the image to R2.
```bash
bun cli.ts log "<description>" <calories> <protein> <carbs> <fat> <local_path> <remote_filename>
```

### 3. List Today's Meals
```bash
bun cli.ts list
```

### 4. Habit Analysis
Provides data for habit reviews.
```bash
bun cli.ts daily-analysis
bun cli.ts weekly-analysis
```

### 5. Clear Data
Clears logs for the current day.
```bash
bun cli.ts clear
```

## Stack
- TypeScript
- Drizzle ORM
- Cloudflare D1 (Database)
- Cloudflare R2 (Storage)
- Wrangler (Local Dev/Deployment)
