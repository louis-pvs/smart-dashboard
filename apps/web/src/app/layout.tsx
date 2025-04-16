import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "@repo/ui/styles.css";

const montserrat = localFont({
  src: [
    {
      path: "../assets/fonts/Montserrat-VariableFont_wght.ttf",
      style: "regular",
    },
    {
      path: "../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-montserrat",
  preload: true,
  fallback: [
    "Arial",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
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
  fallback: [
    "Arial",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: "Tazk.io | Your A-Z AI Powered Taskboard",
  description:
    "Tazk.io is a task management tool that uses AI to help you manage your tasks more efficiently.",
  icons: {
    icon: [
      {
        url: "/favicon-48x48.png",
        type: "image/png",
        sizes: "48x48",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="tazky.io" />
      </head>
      <body
        className={`${montserrat.className} ${inter.className} antialiased min-h-screen overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
