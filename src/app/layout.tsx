import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import { AppProviders } from "@/components/providers/app-providers";
import ConditionalLayout from "@/components/global/ConditionalLayout";
// Trigger hot reload

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerUs Interview | Elevating Professional Journeys",
  description: "Next-generation career coaching, staffing solutions, and interview preparation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
    >
      <body className="min-h-screen bg-background text-foreground">
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
