import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Journi — Every journey begins a story',
    template: '%s | Journi',
  },
  description:
    'A premium travel planning platform where users can create trips, organize itineraries, manage budgets, track packing lists, check weather, and save travel memories.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-brand-bg text-brand-burgundy min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
