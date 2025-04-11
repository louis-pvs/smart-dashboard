import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { SidebarProvider } from "@repo/ui/components/ui/sidebar";
import Sidebar from "@/ui/sidebar";
import Header from "@repo/ui/components/header";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import "@repo/ui/styles.css";
import "./globals.css";

const DM_Sans = localFont({
  src: [
    {
      path: "../assets/fonts/dm-sans-v14-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/dm-sans-v14-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  weight: "regular",
  preload: true,
  style: "normal",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: [
    "-apple-system",
    "blinkmacsystemfont",
    "Segoe UI",
    "roboto",
    "oxygen-sans",
    "ubuntu",
    "cantarell",
    "Helvetica Neue",
    "sans-serif",
  ],
});
export const metadata: Metadata = {
  title: "A.I Powered Dashboard",
  description: "Another A.I portfolio project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${DM_Sans.className} bg-secondary antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <SidebarProvider>
            <Sidebar />
            <main className="min-h-screen relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow bg-card text-card-foreground rounded-4xl p-4">
              <Header />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
