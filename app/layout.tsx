import type { Metadata } from "next";
import { AuthProvider } from "@/app/providers/AuthProvider";
import "./globals.css";

const siteUrl = "https://learnyah-frontend.vercel.app";

const siteName = "LearnYah";

const siteTitle = "LearnYah | Your Personal AI Learning Assistant";

const siteDescription =
  "LearnYah is your personal AI tutor. Upload study materials, ask questions, understand concepts, and practice with AI-powered quizzes.";
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

  creator: "LearnYah",
  publisher: "LearnYah",

  alternates: {
    canonical: "/",
  },

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

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: "/apple-touch-icon.png",
  },


  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "LearnYah",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LearnYah AI Learning Assistant",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
  },

  category: "education",

  // Add your actual verification token if needed.
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  // },
};

// Google WebSite Schema
const websiteSchema = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: siteName,
  alternateName: "Learn Yah",
  url: `${siteUrl}/`,
  description: siteDescription,
  inLanguage: "en",
};

// Software Application Schema
const softwareSchema = {
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/#application`,
  name: siteName,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: `${siteUrl}/`,
  description: siteDescription,
  isAccessibleForFree: true,
};

// Educational Organization Schema
// Use Organization rather than EducationalOrganization
// unless LearnYah is formally an educational institution.
const organizationSchema = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/icon.png`,
  description: siteDescription,
};

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [websiteSchema, softwareSchema, organizationSchema],
  };

  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
