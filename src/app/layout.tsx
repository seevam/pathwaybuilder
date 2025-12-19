import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import { AIMascot } from '@/components/ai-mascot/AIMascot';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'Pathway Builder',
  description: 'Career discovery platform for students',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
          <Sonner />
          <AIMascot />
        </body>
      </html>
    </ClerkProvider>
  );
}
