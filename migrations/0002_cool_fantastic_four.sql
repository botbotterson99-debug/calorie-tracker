ALTER TABLE `meal_items` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `meal_items` ADD `calories` real NOT NULL;--> statement-breakpoint
ALTER TABLE `meal_items` ADD `protein` real;--> statement-breakpoint
ALTER TABLE `meal_items` ADD `carbs` real;--> statement-breakpoint
ALTER TABLE `meal_items` ADD `fat` real;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `total_calories`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `total_protein`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `total_carbs`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `total_fat`;