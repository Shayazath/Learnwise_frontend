
import type { Metadata } from "next";
import { AuthProvider } from "@/app/providers/AuthProvider";
import "./globals.css";

const siteUrl = "https://learnyah-frontend.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "LearnYah",

  title: {
    default: "LearnYah – Your Personal AI Learning Assistant",
    template: "%s | LearnYah",
  },

  description:
    "LearnYah is your personal AI learning assistant. Upload study materials, ask questions, understand complex concepts, and test your knowledge with AI-powered quizzes.",

  keywords: [
    "LearnYah",
    "AI learning assistant",
    "AI study assistant",
    "personal AI tutor",
    "AI study tools",
    "RAG learning assistant",
    "AI quiz generator",
    "PDF AI tutor",
    "AI study platform",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "LearnYah – Your Personal AI Learning Assistant",
    description:
      "Your personal AI tutor to understand concepts, explore study materials and improve your learning.",
    url: siteUrl,
    siteName: "LearnYah",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "LearnYah – Your Personal AI Learning Assistant",
    description:
      "Understand concepts, explore study materials and improve your learning with your personal AI tutor.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  // Keep your actual Google verification token here if using meta verification.
  // verification: {
  //   google: "YOUR_ACTUAL_VERIFICATION_TOKEN",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LearnYah",
    alternateName: ["Learn Yah"],
    url: `${siteUrl}/`,
  };

  return (
    <html lang="en">
      <head>
        {/* Font connections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* LearnYah favicon */}
        <link
          rel="icon"
          href="/icon.png"
          type="image/png"
          sizes="512x512"
        />

        {/* Google Website Name structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
