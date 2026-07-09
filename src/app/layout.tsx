import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { QuoteModalProvider } from '@/providers/QuoteModalProvider';
import { QuoteRequestModal } from '@/components/layout/QuoteRequestModal';
import { InquiryModalProvider } from '@/providers/InquiryModalProvider';
import { InquiryModal } from '@/components/layout/InquiryModal';
import { ChatWidget } from '@/components/layout/ChatWidget';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'GasApps | Industrial Gas Fittings & Engineering Solutions',
  description:
    'Premium gas fittings, instrumentation, and engineering services built on precision and trust.',
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <QuoteModalProvider>
              <InquiryModalProvider>
                {children}
                <QuoteRequestModal />
                <InquiryModal />
                <ChatWidget />
              </InquiryModalProvider>
            </QuoteModalProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
