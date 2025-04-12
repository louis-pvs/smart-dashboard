import type { Metadata } from "next";
import localFont from "next/font/local";
import { SidebarProvider } from "@repo/ui/components/base/sidebar";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import "@repo/ui/styles.css";
import { ModeToggle } from "@repo/ui/components/mode-toggle";

const urbanist = localFont({
  src: [
    {
      path: "../assets/fonts/Urbanist-VariableFont_wght.ttf",
      style: "regular",
    },
    {
      path: "../assets/fonts/Urbanist-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-urbanist",
  preload: true,
  fallback: ["system-ui", "Helvetica", "sans-serif"],
  adjustFontFallback: "Arial",
});
const inter = localFont({
  src: [
    {
      path: "../assets/fonts/Inter-VariableFont_opsz,wght.ttf",
      style: "regular",
    },
    {
      path: "../assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["Helvetica", "sans-serif"],
  adjustFontFallback: "Arial",
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
      <body className={`${urbanist.className} ${inter.className} antialiased min-h-screen overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
