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
  data?: Array<{
    url: string;
    b64_json?: string;
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

export async function generateImage(
  prompt: string,
  width: number = 1024,
  height: number = 1024
): Promise<string> {
  try {
    const response = await client.post<ImageGenerationResponse>(
      '/images/generations',
      {
        model: 'google/gemini-2.5-flash-image',
        prompt,
        width,
        height,
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    if (!response.data.data || response.data.data.length === 0) {
      throw new Error('No image generated');
    }

    // Return base64 or URL
    return response.data.data[0].b64_json || response.data.data[0].url || '';
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
    // Note: This uses the image generation API with a reference image
    // The prompt should describe the character and scene
    const response = await client.post<ImageGenerationResponse>(
      '/images/generations',
      {
        model: 'google/gemini-2.5-flash-image',
        prompt: `${prompt}. Keep the character consistent with the provided reference image.`,
        width,
        height,
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    if (!response.data.data || response.data.data.length === 0) {
      throw new Error('No image generated');
    }

    return response.data.data[0].b64_json || response.data.data[0].url || '';
  } catch (error) {
    console.error('Error in generateImageToImage:', error);
    throw error;
  }
}
