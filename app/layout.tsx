/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FX Checker',
  description: 'A modern currency exchange application built for the Frontend Mentor FX Checker Hackathon.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col bg-background items-center'>
        <nav className='min-w-full flex justify-between px-6 py-5'>
          <div>
            <img alt='logo' src='assets/images/logo.svg' />
          </div>
          <div className='flex items-center'>
            <h2 className='text-neutral-200 text-[10px] sm:text-sm'>
              30 CURRENCIES · EOD · ECB DATA
            </h2>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
