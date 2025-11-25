import { generateText, LLMMessage } from '@/lib/openrouterClient';
import { z } from 'zod';

const PagePlanSchema = z.object({
  pageCount: z.number().min(3).max(10),
});

export async function planPages(storyPrompt: string): Promise<number> {
  const messages: LLMMessage[] = [
    {
      role: 'system',
      content:
        'You are an expert comic book writer and planner. Your task is to analyze a story concept and determine how many pages a comic adaptation should have.',
    },
    {
      role: 'user',
      content: `Story concept: "${storyPrompt}"

Determine the appropriate number of comic pages (3-10 pages) needed to tell this story effectively.
Consider:
- Story complexity
- Key plot points
- Character development moments
- Pacing

Respond in this exact JSON format:
{"pageCount": <number>}

Only respond with valid JSON, no other text.`,
    },
  ];

  try {
    const response = await generateText(messages);
    const parsed = JSON.parse(response);
    const validated = PagePlanSchema.parse(parsed);
    return validated.pageCount;
  } catch (error) {
    console.error('Error planning pages:', error);
    // Default to 4 pages if parsing fails
    return 4;
  }
}
