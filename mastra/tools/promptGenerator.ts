import { generateText, LLMMessage } from '@/lib/openrouterClient';

export async function generatePagePrompts(
  storyPrompt: string,
  pageCount: number
): Promise<string[]> {
  const messages: LLMMessage[] = [
    {
      role: 'system',
      content:
        'You are an expert comic book artist and storyboard creator. Generate detailed visual descriptions for comic panels.',
    },
    {
      role: 'user',
      content: `Story concept: "${storyPrompt}"

Create ${pageCount} detailed visual prompts for comic panels that tell this story.

Each prompt should:
1. Be a detailed scene description optimized for AI image generation
2. Include specific details about character appearance and positioning
3. Describe background, lighting, and mood
4. Suggest panel composition and framing
5. Include dialogue or caption suggestions
6. Be realistic and achievable in 1024x1024 dimensions

Format your response as a numbered list (1., 2., 3., etc.) with each prompt on its own line.
Make sure each panel progresses the narrative naturally.`,
    },
  ];

  try {
    const response = await generateText(messages);

    // Parse numbered list
    const prompts = response
      .split('\n')
      .filter((line) => /^\d+\./.test(line.trim()))
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line) => line.length > 10);

    if (prompts.length === 0) {
      // Fallback prompts
      return generateFallbackPrompts(storyPrompt, pageCount);
    }

    return prompts.slice(0, pageCount);
  } catch (error) {
    console.error('Error generating page prompts:', error);
    return generateFallbackPrompts(storyPrompt, pageCount);
  }
}

function generateFallbackPrompts(
  storyPrompt: string,
  pageCount: number
): string[] {
  const prompts: string[] = [];
  for (let i = 0; i < pageCount; i++) {
    prompts.push(
      `Comic panel ${i + 1}: Scene from the story "${storyPrompt}". ` +
        `Professional comic book illustration, vibrant colors, dynamic composition, ` +
        `detailed background, dramatic lighting. Part ${i + 1} of ${pageCount}.`
    );
  }
  return prompts;
}
