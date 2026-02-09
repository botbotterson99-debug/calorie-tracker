import { drizzle } from 'drizzle-orm/d1';
import { meals } from './schema';
import { eq } from 'drizzle-orm';
import { getDailyAnalytics, getWeeklyAnalytics } from './analytics';

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  GOOGLE_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const db = drizzle(env.DB);

    // ANALYZE: Daily / Weekly
    if (url.pathname === '/analyze/daily') {
      const stats = await getDailyAnalytics(db);
      return Response.json({ period: 'daily', stats });
    }

    if (url.pathname === '/analyze/weekly') {
      const stats = await getWeeklyAnalytics(db);
      return Response.json({ period: 'weekly', stats });
    }

    // DELETE
    if (request.method === 'DELETE' && url.pathname.startsWith('/meals/')) {
      const id = parseInt(url.pathname.split('/').pop() || '');
      await db.delete(meals).where(eq(meals.id, id));
      return Response.json({ success: true, deleted: id });
    }

    // UPDATE (Simple calories override)
    if (request.method === 'PATCH' && url.pathname.startsWith('/meals/')) {
      const id = parseInt(url.pathname.split('/').pop() || '');
      const { calories } = (await request.json()) as any;
      await db.update(meals).set({ calories }).where(eq(meals.id, id));
      return Response.json({ success: true, updated: id });
    }

    return new Response('Bot Botterson Calorie API: /analyze, /meals/:id');
  },
};
