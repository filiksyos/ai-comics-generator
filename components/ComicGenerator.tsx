'use client';

import { useState } from 'react';

interface ComicGeneratorProps {
  onGenerate: (storyPrompt: string) => void;
  isGenerating: boolean;
}

export default function ComicGenerator({
  onGenerate,
  isGenerating,
}: ComicGeneratorProps) {
  const [storyPrompt, setStoryPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyPrompt.trim()) {
      onGenerate(storyPrompt.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        ✨ Create Your Comic
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Story Concept
          </label>
          <textarea
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            placeholder="Describe your comic story idea (e.g., 'A superhero learns the importance of teamwork')..."
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white disabled:opacity-50"
            rows={5}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !storyPrompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? '⏳ Generating...' : '🎨 Generate Comic'}
        </button>
      </form>
    </div>
  );
}
