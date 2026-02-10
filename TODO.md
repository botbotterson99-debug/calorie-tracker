# Calorie Tracker TODO

## Features
- [ ] Refactor `extract-data` to support granular item identification (matching against `products` table).
- [ ] Update `log` command to handle multiple `mealItems` linked to a single `meal`.
- [ ] Implement `add-product` command to populate the `products` database from nutrition labels.
- [ ] Implement `extract-data` logic refinement (better AI instructions for complex meals).
- [ ] Add nutrient goal comparison to `daily-analysis`.

## Technical Debt
- [x] Breakdown `cli.ts` into modular files for better maintainability.
- [ ] Add error handling for failed R2 uploads in `src/storage.ts`.
- [ ] Implement better JSON output formatting for `list` command.

## Maintenance
- [ ] Weekly dependency check.
- [ ] Verify R2 bucket permissions.
