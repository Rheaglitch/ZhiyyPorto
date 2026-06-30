import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ContentProtectionProvider } from "@/components/layout/ContentProtectionProvider";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { GlitchIntro } from "@/components/layout/GlitchIntro";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Zhiyy — Portfolio", template: "%s | Zhiyy" },
  description: "Portfolio of Reavlenia Arezha — Full-stack developer crafting modern, high-performance web experiences.",
  keywords: ["portfolio", "developer", "fullstack", "nextjs", "react", "web"],
  authors: [{ name: "Reavlenia Arezha" }],
  creator: "Reavlenia Arezha",
  openGraph: { type: "website", locale: "id_ID", siteName: "Zhiyy Portfolio" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-950 text-dark-100 min-h-screen`}>
        <ThemeProvider>
          <ContentProtectionProvider>
            <GlitchIntro />
            <ScrollProgress />
            <BackgroundEffects />
            {children}
            <FloatingActions />
          </ContentProtectionProvider>
        </ThemeProvider>

        {/* Tidio live chat — default widget, repositioned via CSS */}
        <Script
          id="tidio-script"
          src="//code.tidio.co/wallov1dqedsk4xnf8mdnzgzxmweosyf.js"
          strategy="lazyOnload"
        />
        {/* Move Tidio above scroll-to-top button (bottom:88px right:20px) */}
        <style>{`
          /* Scroll-to-top: bottom 88px right 20px, size 40px */
          /* Tidio launcher ~52px, gap 12px => bottom: 88+40+12 = 140px */
          #tidio-chat-iframe {
            bottom: 140px !important;
            right:  16px  !important;
            transform-origin: bottom right !important;
            transform: scale(0.82) !important;
          }
          @media (max-width: 767px) {
            /* Mobile: above bottom nav 64px + scroll-to-top 40px + gaps = ~180px */
            #tidio-chat-iframe {
              bottom: 180px !important;
              right:  12px  !important;
              transform: scale(0.75) !important;
            }
          }
          @media (min-width: 768px) and (max-width: 1024px) {
            #tidio-chat-iframe {
              bottom: 148px !important;
              right:  14px  !important;
              transform: scale(0.80) !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
