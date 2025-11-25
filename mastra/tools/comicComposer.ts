import { createComicLayout, saveBase64Image } from '@/lib/imageProcessor';
import * as fs from 'fs';

export async function composeComicLayout(imageBase64Array: string[]): Promise<Buffer> {
  // Convert base64 images to file paths
  const imagePaths: string[] = [];

  for (const base64 of imageBase64Array) {
    if (base64 !== 'PLACEHOLDER') {
      try {
        const filePath = await saveBase64Image(base64);
        imagePaths.push(filePath);
      } catch (error) {
        console.error('Error saving base64 image:', error);
      }
    }
  }

  if (imagePaths.length === 0) {
    throw new Error('No valid images to compose');
  }

  // Determine grid layout based on number of pages
  let rows = 2;
  let cols = 2;

  if (imagePaths.length === 3) {
    rows = 2;
    cols = 2; // Will use 3 of 4 cells
  } else if (imagePaths.length === 4) {
    rows = 2;
    cols = 2;
  } else if (imagePaths.length === 5 || imagePaths.length === 6) {
    rows = 2;
    cols = 3;
  } else if (imagePaths.length > 6) {
    rows = Math.ceil(imagePaths.length / 3);
    cols = 3;
  }

  const comicBuffer = await createComicLayout(imagePaths, rows, cols);

  // Cleanup temp files
  for (const path of imagePaths) {
    try {
      fs.unlinkSync(path);
    } catch (error) {
      console.error(`Failed to delete temp file ${path}:`, error);
    }
  }

  return comicBuffer;
}
