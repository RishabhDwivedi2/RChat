// src/app/api/chat/route.ts

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { config } from 'dotenv';

config();

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const message = formData.get('message') as string;
        const files = formData.getAll('files') as File[];

        let processedFiles = [];
        for (const file of files) {
            const fileBuffer = await file.arrayBuffer();
            const fileBase64 = Buffer.from(fileBuffer).toString('base64');
            processedFiles.push({
                name: file.name,
                type: file.type,
                content: fileBase64
            });
        }

        let prompt = message || '';
        if (processedFiles.length > 0) {
            prompt += "\n\nAttached files:\n";
            processedFiles.forEach(file => {
                prompt += `- ${file.name} (${file.type})\n`;
            });
        }

        const result = await generateText({
            model: openai('gpt-4o'),
            prompt: prompt,
        });

        return new Response(
            JSON.stringify({ text: result.text }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error in API route:", error);
        return new Response(
            JSON.stringify({ error: 'Something went wrong.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}