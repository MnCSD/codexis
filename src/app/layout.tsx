import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codexis - Don't read your codebase. Walk through it.",
  description: "Revolutionary 3D code visualization tool that transforms software codebases into immersive cities. Navigate functions as rooms, classes as buildings, modules as neighborhoods.",
  keywords: "code visualization, 3D codebase, developer tools, software navigation, code exploration, programming visualization",
  authors: [{ name: "Codexis Team" }],
  openGraph: {
    title: "Codexis - Revolutionary 3D Code Visualization",
    description: "Transform your codebase into an immersive 3D city. Navigate, explore, and understand code like never before.",
    type: "website",
    siteName: "Codexis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codexis - 3D Code Visualization",
    description: "Don't read your codebase. Walk through it.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
