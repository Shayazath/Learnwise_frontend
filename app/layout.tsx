
import type { Metadata } from "next";
import { AuthProvider } from "@/app/providers/AuthProvider";
// Next.js handles global CSS imports; this also suppresses editors without Next's CSS module declarations.
// @ts-ignore
import "./globals.css";

// Website configuration
const siteUrl = "https://learnyah-frontend.vercel.app";

const siteName = "LearnYah";

const siteTitle =
  "LearnYah | Your Personal AI Learning Assistant";

const siteDescription =
  "LearnYah is your personal AI tutor. Upload study materials, ask questions, understand concepts, and practice with AI-powered quizzes.";

const ogDescription =
  "Learn smarter with LearnYah. Upload study materials, ask questions, understand concepts, and practice with AI quizzes.";

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: siteName,

  title: {
    default: siteTitle,
    template: "%s | LearnYah",
  },

  description: siteDescription,

  keywords: [
    "LearnYah",
    "Learn Yah",
    "AI Learning Assistant",
    "AI Study Assistant",
    "Personal AI Tutor",
    "AI Tutor",
    "AI Education Platform",
    "AI Study Tools",
    "RAG Learning Assistant",
    "AI Quiz Generator",
    "PDF AI Tutor",
    "AI Study Platform",
    "AI Powered Learning",
    "Document Question Answering",
    "Personalized Learning",
    "Generative AI Education",
  ],

  authors: [
    {
      name: "LearnYah",
      url: siteUrl,
    },
  ],

  creator: siteName,
  publisher: siteName,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: siteTitle,
    description: ogDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LearnYah - Your Personal AI Learning Assistant",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: ogDescription,
    images: ["/og-image.png"],
  },

  category: "education",

  // Uncomment if you use Google meta-tag verification.
  // verification: {
  //   google: "YOUR_ACTUAL_GOOGLE_VERIFICATION_TOKEN",
  // },
};

// WebSite schema for Google's site-name system
const websiteSchema = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: siteName,
  alternateName: "Learn Yah",
  url: `${siteUrl}/`,
  description: siteDescription,
  inLanguage: "en",
};

// SoftwareApplication schema
const softwareSchema = {
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/#application`,
  name: siteName,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: `${siteUrl}/`,
  description: siteDescription,
};

// Organization schema
const organizationSchema = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/icon.png`,
  description: siteDescription,
};

// Structured data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    websiteSchema,
    softwareSchema,
    organizationSchema,
  ],
};

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
      </head>

      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
