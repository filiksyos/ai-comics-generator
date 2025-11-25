import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const TEMP_DIR = path.join(process.cwd(), 'tmp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export async function saveBase64Image(base64: string): Promise<string> {
  const timestamp = Date.now();
  const filePath = path.join(TEMP_DIR, `image-${timestamp}.png`);
  const buffer = Buffer.from(base64, 'base64');
  await fs.promises.writeFile(filePath, buffer);
  return filePath;
}

export async function createComicLayout(
  imagePaths: string[],
  rows: number,
  cols: number
): Promise<Buffer> {
  // Calculate dimensions
  const pageWidth = 1200;
  const pageHeight = 1600;
  const padding = 20;
  const imageWidth = (pageWidth - (cols + 1) * padding) / cols;
  const imageHeight = (pageHeight - (rows + 1) * padding) / rows;

  // Start with blank canvas
  let composite = sharp({
    create: {
      width: pageWidth,
      height: pageHeight,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  });

  const overlays: Array<{
    input: Buffer;
    left: number;
    top: number;
  }> = [];

  // Process each image
  for (let i = 0; i < imagePaths.length && i < rows * cols; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const left = col * (imageWidth + padding) + padding;
    const top = row * (imageHeight + padding) + padding;

    const imageBuffer = await sharp(imagePaths[i])
      .resize(Math.floor(imageWidth), Math.floor(imageHeight), {
        fit: 'cover',
        position: 'center',
      })
      .png()
      .toBuffer();

    overlays.push({
      input: imageBuffer,
      left: Math.floor(left),
      top: Math.floor(top),
    });
  }

  // Apply overlays
  if (overlays.length > 0) {
    composite = composite.composite(overlays);
  }

  return composite.png().toBuffer();
}

export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function imageUrlToBase64(url: string): Promise<string> {
  const buffer = await downloadImage(url);
  return buffer.toString('base64');
}
