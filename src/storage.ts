import { execSync } from 'child_process';
import { resolve } from 'path';

const PROJECT_DIR = resolve(__dirname, '..');
const CONFIG = resolve(PROJECT_DIR, 'wrangler.json');

export function uploadImage(localPath: string, filename: string) {
  console.log(`Uploading ${localPath} to R2 as ${filename}...`);
  execSync(
    `npx wrangler r2 object put calorie-tracker-images/${filename} --file ${localPath} --config ${CONFIG} --local`,
    { stdio: 'inherit' }
  );
}
