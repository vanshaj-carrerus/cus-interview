import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import { AppProviders } from "@/components/providers/app-providers";
import ConditionalLayout from "@/components/global/ConditionalLayout";
// Trigger hot reload

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CUS Interview | Elevating Professional Journeys",
  description: "Next-generation career coaching, staffing solutions, and interview preparation platform.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased light`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <NextTopLoader
          color="#5bb9e5"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <AppProviders>
          <ConditionalLayout header={<Header />} footer={<Footer />}>
            {children}
          </ConditionalLayout>
        </AppProviders>
      </body>
    </html>
  );
}
