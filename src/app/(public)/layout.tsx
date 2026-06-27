import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentProtectionProvider } from "@/components/layout/ContentProtectionProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContentProtectionProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ContentProtectionProvider>
  );
}
