import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Comics Generator',
  description: 'Generate AI-powered comic strips with character consistency',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
