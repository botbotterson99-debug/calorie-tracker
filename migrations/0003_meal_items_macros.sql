-- Add nutrition columns and name to meal_items
ALTER TABLE meal_items ADD COLUMN name TEXT NOT NULL DEFAULT '';
ALTER TABLE meal_items ADD COLUMN calories REAL NOT NULL DEFAULT 0;
ALTER TABLE meal_items ADD COLUMN protein REAL;
ALTER TABLE meal_items ADD COLUMN carbs REAL;
ALTER TABLE meal_items ADD COLUMN fat REAL;

-- Migrate existing meal totals into a single meal_item per meal
INSERT INTO meal_items (meal_id, name, amount, unit, calories, protein, carbs, fat)
SELECT id, name, 1, 'meal', total_calories, total_protein, total_carbs, total_fat
FROM meals
WHERE id NOT IN (SELECT DISTINCT meal_id FROM meal_items WHERE meal_id IS NOT NULL);

-- Recreate meals table without total macro columns
CREATE TABLE meals_v2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_definitive INTEGER DEFAULT 0
);

INSERT INTO meals_v2 (id, timestamp, image_url, name, category, description, is_definitive)
SELECT id, timestamp, image_url, name, category, description, is_definitive FROM meals;

DROP TABLE meals;
ALTER TABLE meals_v2 RENAME TO meals;
