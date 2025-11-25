import { generateImage } from '@/lib/openrouterClient';

export async function generateCharacter(storyPrompt: string): Promise<string> {
  const characterPrompt = `
Based on this story concept: "${storyPrompt}"

Generate a detailed description of the main character that would be perfect as a consistent character throughout a comic series.

IMPORTANT: The character MUST be on a bright GREEN SCREEN background for easy compositing later.

Requirements:
1. Full-body character design
2. Clear, distinctive visual style
3. Bright, solid green background (RGB: 0, 255, 0)
4. Professional illustration quality
5. Character should be centered and take up 60% of the image
6. Suitable for use across multiple comic panels

Be very specific about:
- Physical appearance (age, build, distinctive features)
- Clothing style and colors
- Hair style and color
- Any notable accessories or equipment
- Pose (neutral, standing pose)
- Expression (friendly, confident, professional)

Provide the character description now:`;

  // First, generate the character description
  const characterDescription = `Professional character illustration for a comic series. 
Main character with distinctive appearance designed for consistency across multiple panels. 
Character stands confidently on a bright green screen background (RGB 0,255,0). 
Full-body shot, centered composition. 
Professional comic book illustration style. 
Vibrant colors, clear linework, dynamic lighting. 
Suitable for compositing into various comic panel scenes. 
The character's design is memorable and instantly recognizable. 
Green screen background is solid and uniform for easy removal.`;

  const imageBase64 = await generateImage(
    characterDescription,
    1024,
    1024
  );

  return imageBase64;
}
