import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY environment variable is required');
}

const client = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': APP_URL,
    'X-Title': 'AI Comics Generator',
  },
});

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TextGenerationResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ImageGenerationResponse {
  choices?: Array<{
    message: {
      role: string;
      content?: string;
      images?: Array<{
        type: string;
        image_url: {
          url: string; // Base64 data URL (data:image/png;base64,...)
        };
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

export async function generateText(
  messages: LLMMessage[],
  model: string = 'openai/gpt-4-mini'
): Promise<string> {
  try {
    const response = await client.post<TextGenerationResponse>(
      '/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateText:', error);
    throw error;
  }
}

// Helper function to calculate aspect ratio from dimensions
function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export async function generateImage(
  prompt: string,
  width: number = 1024,
  height: number = 1024
): Promise<string> {
  try {
    const response = await client.post<ImageGenerationResponse>(
      '/chat/completions',
      {
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        modalities: ['image', 'text'],
        image_config: {
          aspect_ratio: calculateAspectRatio(width, height),
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    if (
      !response.data.choices ||
      !response.data.choices[0]?.message?.images ||
      response.data.choices[0].message.images.length === 0
    ) {
      throw new Error('No image generated');
    }

    // Extract base64 data from data URL (format: data:image/png;base64,...)
    const imageUrl = response.data.choices[0].message.images[0].image_url.url;
    
    // If it's a data URL, extract just the base64 part
    if (imageUrl.startsWith('data:image')) {
      const base64Match = imageUrl.match(/base64,(.+)/);
      return base64Match ? base64Match[1] : imageUrl;
    }
    
    return imageUrl;
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
}

export async function generateImageToImage(
  prompt: string,
  imageBase64: string,
  strength: number = 0.7,
  width: number = 1024,
  height: number = 1024
): Promise<string> {
  try {
    // Note: This uses the chat completions API with a reference image
    // The prompt should describe the character and scene
    // Include the reference image in the message content
    const response = await client.post<ImageGenerationResponse>(
      '/chat/completions',
      {
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${prompt}. Keep the character consistent with the provided reference image.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:')
                    ? imageBase64
                    : `data:image/png;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        modalities: ['image', 'text'],
        image_config: {
          aspect_ratio: calculateAspectRatio(width, height),
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    if (
      !response.data.choices ||
      !response.data.choices[0]?.message?.images ||
      response.data.choices[0].message.images.length === 0
    ) {
      throw new Error('No image generated');
    }

    // Extract base64 data from data URL
    const imageUrl = response.data.choices[0].message.images[0].image_url.url;
    
    // If it's a data URL, extract just the base64 part
    if (imageUrl.startsWith('data:image')) {
      const base64Match = imageUrl.match(/base64,(.+)/);
      return base64Match ? base64Match[1] : imageUrl;
    }
    
    return imageUrl;
  } catch (error) {
    console.error('Error in generateImageToImage:', error);
    throw error;
  }
}
