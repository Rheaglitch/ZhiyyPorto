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

        {/* Tidio live chat */}
        <Script
          id="tidio-script"
          src="//code.tidio.co/wallov1dqedsk4xnf8mdnzgzxmweosyf.js"
          strategy="lazyOnload"
        />
        {/* Hide Tidio launcher ONLY — keep chat window functional */}
        <Script id="tidio-hide" strategy="lazyOnload">{`
          function hideTidioLauncher() {
            try {
              var el = document.getElementById('tidio-chat-iframe');
              if (!el) return false;
              var doc = el.contentDocument || el.contentWindow && el.contentWindow.document;
              if (!doc) return false;
              // Inject CSS into Tidio iframe to hide only the launcher button
              var style = doc.createElement('style');
              style.textContent = '[class*="chat-icon"],[class*="launcher"],[aria-label*="chat"],[aria-label*="Chat"]{display:none!important}';
              doc.head.appendChild(style);
              return true;
            } catch(e) { return false; }
          }
          document.addEventListener('tidioChat-ready', function() {
            // Try to hide launcher via API setting
            if (window.tidioChatApi) {
              window.tidioChatApi.on('close', function() {
                // keep iframe visible so window stays accessible
              });
            }
            // Attempt to hide launcher button inside iframe
            var attempts = 0;
            var interval = setInterval(function() {
              if (hideTidioLauncher() || ++attempts > 20) clearInterval(interval);
            }, 300);
          });
        `}</Script>
      </body>
    </html>
  );
}
