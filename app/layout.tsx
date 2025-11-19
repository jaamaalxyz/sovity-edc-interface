import "./globals.css";

import type { Metadata } from "next";

import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Sovity EDC Manager",
  description: "Asset and Policy Management for Sovity EDC Connector",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-primary-600 focus:p-4 focus:text-white"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main id="main-content" className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
