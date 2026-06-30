import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ContentProtectionProvider } from "@/components/layout/ContentProtectionProvider";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { ChatBot } from "@/components/layout/ChatBot";
import { GlitchIntro } from "@/components/layout/GlitchIntro";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zhiyy — Portfolio",
    template: "%s | Zhiyy",
  },
  description:
    "Portfolio of Reavlenia Arezha — Full-stack developer crafting modern, high-performance web experiences.",
  keywords: ["portfolio", "developer", "fullstack", "nextjs", "react", "web"],
  authors: [{ name: "Reavlenia Arezha" }],
  creator: "Reavlenia Arezha",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Zhiyy Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-950 text-dark-100 min-h-screen`}
      >
        <ThemeProvider>
          <ContentProtectionProvider>
            <GlitchIntro />
            <ScrollProgress />
            <BackgroundEffects />
            {children}
            <FloatingActions />
            <ChatBot />
            <ChatBot />
          </ContentProtectionProvider>
        </ThemeProvider>

        {/* Tidio — custom ball triggers it, hide default launcher */}
        <Script
          src="//code.tidio.co/wallov1dqedsk4xnf8mdnzgzxmweosyf.js"
          strategy="lazyOnload"
        />
        <style>{`
          /* Point 1: Hide Tidio default launcher widget */
          #tidio-chat-iframe { display: none !important; visibility: hidden !important; }
          #tidio-chat         { opacity: 0; pointer-events: none; }
          /* Re-show chat WINDOW (not launcher) when Tidio is open */
          #tidio-chat.tidio-chat-open { opacity: 1 !important; pointer-events: all !important; }
        `}</style>
      </body>
    </html>
  );
}
