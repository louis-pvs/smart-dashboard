import type { Metadata } from "next";
import { SidebarProvider } from "@repo/ui/components/ui/sidebar";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar, { SidebarTrigger } from "@repo/ui/components/web-sidebar";
import "@repo/ui/styles.css";
import { ThemeProvider } from "@repo/ui/components/theme-provider";

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
      <body className={`${DM_Sans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <SidebarProvider>
            <Sidebar />
            <SidebarTrigger />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
