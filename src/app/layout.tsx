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
  title: "Nex | The High-Performance Digital Queue Platform",
  description: "Experience the future of waiting with Nex. A high-performance, real-time digital queue management system for modern businesses. Frictionless tokens, zero-install access, and live updates.",
  keywords: ["nex", "nex queue", "digital queue", "virtual waitlist", "queue management", "real-time queueing", "line manager", "digital terminal", "clinic queue system", "salon waitlist"],
  authors: [{ name: "Nex" }],
  openGraph: {
    title: "Nex | Next-Gen Queue Management",
    description: "The ultimate zero-friction waiting line manager. Real-time digital tokens for modern businesses.",
    url: "https://nex-lovat.vercel.app",
    siteName: "Nex",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nex | High-Performance Wait List Software",
    description: "The ultimate zero-friction digital queue manager.",
    images: ["/icon.png"],
  },
  verification: {
    google: "23CdBJkd0MUDCmPcSybd-31YjPRzHY9VJxg1WrOm5zM",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
  },
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background text-foreground" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
