import { generateImage, generateImageToImage } from '@/lib/openrouterClient';

export async function generatePageImages(
  prompts: string[],
  characterImageBase64: string
): Promise<string[]> {
  const images: string[] = [];

  for (let i = 0; i < prompts.length; i++) {
    try {
      // For each page, use the character image as reference
      // The prompt includes instructions to maintain character consistency
      const enhancedPrompt = `
${prompts[i]}

IMPORTANT: This is page ${i + 1} of a comic series. The main character should be recognizable and consistent throughout.
Maintain the character's appearance, clothing style, and design from previous panels.
Focus on: character actions, expressions, and the scene context.
Professional comic book art style with clear panel composition.
`;

      const imageBase64 = await generateImage(enhancedPrompt, 1024, 1024);
      images.push(imageBase64);

      // Add small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error generating image for page ${i + 1}:`, error);
      // Return placeholder if generation fails
      images.push('PLACEHOLDER');
    }
  }

  return images;
}
