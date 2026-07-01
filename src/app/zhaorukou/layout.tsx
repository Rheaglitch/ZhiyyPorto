import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide Tidio chatbot in admin area — only show on public pages */}
      <style>{`#tidio-chat-iframe { display: none !important; }`}</style>
      {children}
    </>
  );
}
