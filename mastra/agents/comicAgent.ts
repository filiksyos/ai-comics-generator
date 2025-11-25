import { generateCharacter } from '../tools/characterGenerator';
import { planPages } from '../tools/pagePlanner';
import { generatePagePrompts } from '../tools/promptGenerator';
import { generatePageImages } from '../tools/imageGenerator';
import { composeComicLayout } from '../tools/comicComposer';

export async function generateComic(
  storyPrompt: string,
  sendUpdate: (data: any) => void
) {
  try {
    // Step 1: Generate Character
    sendUpdate({
      isGenerating: true,
      currentStep: 'Generating main character with green screen...',
      progress: 10,
    });

    const characterImage = await generateCharacter(storyPrompt);
    sendUpdate({
      currentStep: 'Character generated!',
      progress: 20,
      characterImage: `data:image/png;base64,${characterImage}`,
    });

    // Step 2: Plan pages
    sendUpdate({
      currentStep: 'Planning comic narrative...',
      progress: 30,
    });

    const pageCount = await planPages(storyPrompt);
    sendUpdate({
      currentStep: `Planning ${pageCount} pages...`,
      progress: 40,
    });

    // Step 3: Generate prompts for each page
    sendUpdate({
      currentStep: 'Creating prompts for each page...',
      progress: 50,
    });

    const pagePrompts = await generatePagePrompts(
      storyPrompt,
      pageCount
    );
    sendUpdate({
      currentStep: `Generated ${pagePrompts.length} page prompts`,
      progress: 60,
    });

    // Step 4: Generate images for each page
    sendUpdate({
      currentStep: 'Generating page images...',
      progress: 70,
    });

    const pageImages = await generatePageImages(
      pagePrompts,
      characterImage
    );
    sendUpdate({
      currentStep: `Generated ${pageImages.length} images`,
      progress: 85,
    });

    // Step 5: Compose comic layout
    sendUpdate({
      currentStep: 'Arranging pages into comic layout...',
      progress: 90,
    });

    const comicBuffer = await composeComicLayout(pageImages);
    const comicBase64 = comicBuffer.toString('base64');

    // Final update
    sendUpdate({
      isGenerating: false,
      currentStep: 'Comic generation complete!',
      progress: 100,
      comicImage: `data:image/png;base64,${comicBase64}`,
      pages: pagePrompts.map((prompt, idx) => ({
        id: idx + 1,
        prompt,
      })),
    });
  } catch (error) {
    console.error('Error in comic generation:', error);
    sendUpdate({
      isGenerating: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error during generation',
    });
  }
}
