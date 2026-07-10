import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Geist } from "next/font/google";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { QuoteModalProvider } from "@/providers/QuoteModalProvider";
import { InquiryModalProvider } from "@/providers/InquiryModalProvider";

import { QuoteRequestModal } from "@/components/layout/QuoteRequestModal";
import { InquiryModal } from "@/components/layout/InquiryModal";
import { ChatWidget } from "@/components/layout/ChatWidget";

import { TooltipProvider } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "GasApps | Industrial Gas Fittings & Engineering Solutions",
  description:
    "Premium gas fittings, instrumentation, and engineering services built on precision and trust.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        spaceGrotesk.variable,
        inter.variable,
        jetbrainsMono.variable,
        "font-sans",
        geist.variable
      )}
    >
     

      <body
        className="flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        <TooltipProvider>
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
        </TooltipProvider>
      </body>
    </html>
  );
}