import { drizzle } from 'drizzle-orm/d1';
import { meals } from './schema';

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  GOOGLE_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/upload') {
      try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        
        if (!file) return new Response('Missing image', { status: 400 });

        const filename = `meal-${Date.now()}.jpg`;
        
        // 1. Store in R2
        await env.BUCKET.put(filename, file.stream(), {
          httpMetadata: { contentType: file.type }
        });

        // 2. Vision Analysis via Gemini 1.5 Flash (or 3 when GA)
        const analysis = await analyzeImageWithGemini(file, env.GOOGLE_API_KEY);

        // 3. Log to D1
        const db = drizzle(env.DB);
        await db.insert(meals).values({
          timestamp: new Date(),
          imageUrl: filename,
          description: analysis.description,
          calories: analysis.calories,
          nutrients: JSON.stringify(analysis.nutrients),
        });

        return new Response(JSON.stringify({ success: true, analysis }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    return new Response('Bot Botterson Calorie Tracker API');
  },
};

async function analyzeImageWithGemini(file: File, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const base64Data = btoa(
    new Uint8Array(await file.arrayBuffer())
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Analyze this meal. Provide a brief description, estimated total calories, and macros (protein, carbs, fat in grams). Respond only in valid JSON format: {\"description\": string, \"calories\": number, \"nutrients\": {\"protein\": number, \"carbs\": number, \"fat\": number}}" },
          { inline_data: { mime_type: file.type, data: base64Data } }
        ]
      }],
      generationConfig: { response_mime_type: "application/json" }
    })
  });

  const data: any = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}
