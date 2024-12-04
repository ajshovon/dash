import { AuthProvider } from '@/providers/authContext';
import SonnerToast from '@/providers/SonnerToast';
import { SiteThemeProviders } from '@/providers/theme.provider';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'DASH',
  description: 'DASH: Distributed Address Shortening Hub is a URL shortening self hosted app that allows you to shorten long URLs into short, easy-to-remember links.',
  metadataBase: new URL('https://dash.shovon.me'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <SiteThemeProviders>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <SonnerToast />
            </ThemeProvider>
          </SiteThemeProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
