import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import type { Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NinjaKamui',
  description:
    'NinjaKamui.net provides a complimentary service for streaming Anime. You can enjoy watching your favorite anime series without any cost.',
};

export const viewport: Viewport = {
  themeColor: '#0394fc',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
