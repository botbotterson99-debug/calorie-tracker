CREATE TABLE `meal_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meal_id` integer,
	`product_id` integer,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`unit` text DEFAULT 'grams',
	`calories` real NOT NULL,
	`protein` real,
	`carbs` real,
	`fat` real,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer NOT NULL,
	`image_url` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`is_definitive` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`brand` text,
	`calories_per_100` real NOT NULL,
	`protein_per_100` real,
	`carbs_per_100` real,
	`fat_per_100` real,
	`sugar_per_100` real,
	`serving_size` real,
	`metadata` text
);
