'use client';

import { useState } from 'react';
import ComicGenerator from '@/components/ComicGenerator';
import ProgressTracker from '@/components/ProgressTracker';
import ComicPreview from '@/components/ComicPreview';

export default function Home() {
  const [generationState, setGenerationState] = useState<{
    isGenerating: boolean;
    currentStep: string;
    progress: number;
    characterImage?: string;
    pages?: any[];
    comicImage?: string;
    error?: string;
  }>({
    isGenerating: false,
    currentStep: '',
    progress: 0,
  });

  const handleGenerate = async (storyPrompt: string) => {
    setGenerationState({
      isGenerating: true,
      currentStep: 'Starting generation...',
      progress: 0,
    });

    try {
      const response = await fetch('/api/generate-comic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate comic');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            setGenerationState((prev) => ({ ...prev, ...data }));
          }
        }
      }
    } catch (error) {
      setGenerationState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎨 AI Comics Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create amazing comic strips with AI-powered character consistency
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <ComicGenerator
            onGenerate={handleGenerate}
            isGenerating={generationState.isGenerating}
          />

          {generationState.isGenerating && (
            <ProgressTracker
              currentStep={generationState.currentStep}
              progress={generationState.progress}
              characterImage={generationState.characterImage}
            />
          )}

          {generationState.comicImage && !generationState.isGenerating && (
            <ComicPreview
              comicImage={generationState.comicImage}
              pages={generationState.pages || []}
            />
          )}

          {generationState.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">
                Error: {generationState.error}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
