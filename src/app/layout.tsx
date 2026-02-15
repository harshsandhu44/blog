import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Harsh Sandhu - Tech, Business, and Reflection",
    template: "%s | Harsh Sandhu",
  },
  description:
    "A personal blog by Harsh Sandhu covering technology, business strategy, self-reflection, and thoughts in progress.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2&f[]=comico@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={GeistMono.variable}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
