import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-reset-otp",
        "/api/",
      ],
    },
    sitemap:
      "https://learnyah-frontend.vercel.app/sitemap.xml",
  };
}