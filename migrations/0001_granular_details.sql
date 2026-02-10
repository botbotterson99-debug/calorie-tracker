CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT,
  calories_per_100 REAL NOT NULL,
  protein_per_100 REAL,
  carbs_per_100 REAL,
  fat_per_100 REAL,
  serving_size REAL,
  metadata TEXT
);

CREATE TABLE IF NOT EXISTS meals_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  total_calories REAL NOT NULL,
  total_protein REAL,
  total_carbs REAL,
  total_fat REAL,
  is_definitive INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meal_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meal_id INTEGER REFERENCES meals_new(id),
  product_id INTEGER REFERENCES products(id),
  amount REAL NOT NULL,
  unit TEXT DEFAULT 'grams'
);

-- Migrate existing data from old meals to meals_new
INSERT INTO meals_new (id, timestamp, image_url, name, category, description, total_calories, is_definitive)
SELECT id, timestamp, image_url, description, 'Uncategorized', description, calories, 0 FROM meals;

DROP TABLE meals;
ALTER TABLE meals_new RENAME TO meals;
