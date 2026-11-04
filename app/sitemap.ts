import type { MetadataRoute } from "next";
import { getProjectRecords, projectPath } from "./lib/content/archive";
import { loadContent } from "./lib/content/server";
import { absoluteUrl } from "./lib/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await loadContent();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl("/projects"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/experience"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const projects = getProjectRecords(content).map(
    (project): MetadataRoute.Sitemap[number] => ({
      url: absoluteUrl(projectPath(project.id)),
      changeFrequency: "yearly",
      priority: 0.7,
    })
  );

  return [...pages, ...projects];
}
