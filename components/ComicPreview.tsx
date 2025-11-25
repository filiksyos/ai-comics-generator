'use client';

interface ComicPreviewProps {
  comicImage: string;
  pages: Array<{ id: number; prompt: string }>;
}

export default function ComicPreview({
  comicImage,
  pages,
}: ComicPreviewProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = comicImage;
    link.download = 'comic-strip.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          ✅ Your Comic is Ready!
        </h2>

        {/* Comic Preview */}
        <div className="mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-auto max-h-96">
            <img
              src={comicImage}
              alt="Generated comic strip"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all mb-6"
        >
          📥 Download Comic
        </button>

        {/* Pages Info */}
        {pages.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              📖 Comic Pages ({pages.length})
            </h3>
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Page {page.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {page.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
