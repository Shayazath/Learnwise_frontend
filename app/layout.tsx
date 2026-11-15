
import type { Metadata } from "next";
import { AuthProvider } from "@/app/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
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

  metadataBase: new URL(
    "https://learnyah-frontend.vercel.app"
  ),

  openGraph: {
    title: "LearnYah – Learn in Your Own Way",
    description:
      "Your personal AI tutor to understand concepts, explore study materials and improve your learning.",
    url: "https://learnyah-frontend.vercel.app",
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
  },

  // If using Google HTML meta-tag verification,
  // add the actual content token here.
  // verification: {
  //   google: "YOUR_ACTUAL_VERIFICATION_TOKEN",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
