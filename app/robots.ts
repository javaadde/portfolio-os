import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The JSON content API duplicates the pages; keep crawlers on the HTML.
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
