import { NextRequest } from 'next/server';
import { generateComic } from '@/mastra/agents/comicAgent';

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const { storyPrompt } = await req.json();

  if (!storyPrompt) {
    return new Response('Story prompt is required', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const sendUpdate = (data: any) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        };

        await generateComic(storyPrompt, sendUpdate);
        controller.close();
      } catch (error) {
        console.error('Error generating comic:', error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              error:
                error instanceof Error ? error.message : 'Unknown error',
              isGenerating: false,
            })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
