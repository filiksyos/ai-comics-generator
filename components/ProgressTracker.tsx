'use client';

interface ProgressTrackerProps {
  currentStep: string;
  progress: number;
  characterImage?: string;
}

export default function ProgressTracker({
  currentStep,
  progress,
  characterImage,
}: ProgressTrackerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        🎬 Generation Progress
      </h2>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-purple-200 dark:border-gray-600">
          <p className="text-gray-900 dark:text-white font-medium flex items-center">
            <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mr-3 animate-pulse" />
            {currentStep}
          </p>
        </div>

        {/* Character Preview */}
        {characterImage && (
          <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Generated Character:
            </p>
            <img
              src={characterImage}
              alt="Generated character"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
