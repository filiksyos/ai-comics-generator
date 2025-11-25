# 🎨 AI Comics Generator

Generate stunning AI-powered comic strips with consistent characters using Mastra, Next.js, and OpenRouter.

## ✨ Features

- **Character Generation**: Creates a consistent main character with green screen background
- **Intelligent Page Planning**: AI decides optimal number of pages and narrative structure
- **Smart Prompt Generation**: Creates detailed prompts for each comic panel
- **Image-to-Image Generation**: Maintains character consistency across all pages
- **Comic Strip Layout**: Automatically arranges images into professional comic grid
- **One-Click Download**: Export your comic as high-quality PNG

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key ([Get one free here](https://openrouter.ai/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/filiksyos/ai-comics-generator.git
   cd ai-comics-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your OpenRouter API key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 📖 How It Works

### Workflow Pipeline

1. **Character Generation**: Generates a unique main character with green screen background for easy compositing
2. **Page Planning**: Uses LLM to determine optimal page count (3-10 pages)
3. **Prompt Generation**: Creates detailed visual descriptions for each comic page
4. **Image Generation**: Generates panel images using Gemini 2.5 Flash Image, maintaining character consistency
5. **Comic Composition**: Arranges images into a professional comic strip grid layout
6. **Export**: Download as high-quality PNG

### Architecture

```
Next.js 15 App Router
  ├── Frontend UI (React 19)
  ├── API Routes (Server-side)
  └── Mastra Agents
      ├── Comic Agent (Orchestration)
      ├── Character Generator Tool
      ├── Page Planner Tool
      ├── Prompt Generator Tool
      ├── Image Generator Tool
      └── Comic Composer Tool
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Required: OpenRouter API Key
OPENROUTER_API_KEY=your_api_key_here

# Optional: Application URL (defaults to http://localhost:3000)
APP_URL=http://localhost:3000
```

### Models Used

- **Text Generation**: `openai/gpt-4-mini` via OpenRouter
- **Image Generation**: `google/gemini-2.5-flash-image` via OpenRouter

## 📁 Project Structure

```
ai-comics-generator/
├── app/
│   ├── page.tsx                    # Main page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── api/
│       └── generate-comic/
│           └── route.ts            # Comic generation endpoint
├── components/
│   ├── ComicGenerator.tsx          # Story input form
│   ├── ProgressTracker.tsx         # Generation progress UI
│   └── ComicPreview.tsx            # Final comic display
├── lib/
│   ├── openrouterClient.ts         # OpenRouter API client
│   └── imageProcessor.ts           # Image processing utilities
├── mastra/
│   ├── agents/
│   │   └── comicAgent.ts           # Main orchestration agent
│   └── tools/
│       ├── characterGenerator.ts   # Character generation tool
│       ├── pagePlanner.ts          # Page planning tool
│       ├── promptGenerator.ts      # Prompt generation tool
│       ├── imageGenerator.ts       # Image generation tool
│       └── comicComposer.ts        # Comic layout tool
├── .env.example                    # Example environment variables
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

## 🛠️ Development

### Available Scripts

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🎯 Usage

1. **Enter Story Concept**: Describe your comic story idea in the text area
2. **Generate**: Click the "Generate Comic" button
3. **Watch Progress**: Monitor the generation progress with real-time updates
4. **Review Comic**: Preview your generated comic strip
5. **Download**: Save the comic as PNG

## 📊 Customization

### Adjust Comic Layout

Edit `mastra/tools/comicComposer.ts`:

```typescript
const pageWidth = 1200;    // Canvas width
const pageHeight = 1600;   // Canvas height
const padding = 20;        // Padding between panels
```

### Change Image Dimensions

Edit `mastra/tools/imageGenerator.ts`:

```typescript
const imageBase64 = await generateImage(enhancedPrompt, 1024, 1024);
// Change dimensions (width, height)
```

### Modify Page Count Range

Edit `mastra/tools/pagePlanner.ts`:

```typescript
const PagePlanSchema = z.object({
  pageCount: z.number().min(3).max(10),  // Adjust min/max
});
```

## 🔐 API Rate Limiting

OpenRouter has rate limits. The app includes small delays between image generation requests to avoid hitting limits. Adjust the delay in `mastra/tools/imageGenerator.ts`:

```typescript
await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
```

## 🐛 Troubleshooting

### "OPENROUTER_API_KEY not found"

- Ensure your `.env.local` file exists and has the correct API key
- Restart the development server after adding the key

### Image generation fails

- Check your OpenRouter API key has sufficient credits
- Verify your API key at https://openrouter.ai/
- Check rate limiting with the delay settings

### Timeout errors

- Image generation can take time; increase the timeout in your fetch calls if needed
- Consider using a queue system for production

## 🚀 Deployment

### Deploy on Vercel

```bash
# Push to GitHub
git push origin main

# Connect to Vercel and deploy
# Set OPENROUTER_API_KEY in environment variables
```

### Environment Variables on Vercel

1. Go to project settings
2. Add environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `APP_URL`: Your deployment URL

## 📝 License

MIT License - feel free to use this project for personal and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenRouter](https://openrouter.ai/)
- Image generation using [Gemini 2.5 Flash Image](https://ai.google.dev/)
- Agent orchestration with [Mastra](https://mastra.ai/)

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Open an issue on GitHub
3. Check OpenRouter documentation for API issues

---

**Made with ❤️ using AI and open-source technologies**
