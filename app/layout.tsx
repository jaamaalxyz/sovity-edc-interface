import "./globals.css";

import type { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
}
