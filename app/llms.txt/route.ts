import { getProjectRecords, projectPath } from "../lib/content/archive";
import { loadContent } from "../lib/content/server";
import { absoluteUrl } from "../lib/content/site";

export const dynamic = "force-static";

/**
 * /llms.txt — the community proposal at llmstxt.org. Generated from
 * data/portfolio.json so it can never drift from the pages it links to.
 */
export async function GET() {
  const content = await loadContent();
  const projects = getProjectRecords(content);
  const { profile } = content;

  const lines: string[] = [
    `# ${profile.name} — Developer Portfolio`,
    "",
    `> The official portfolio of ${profile.name}, a ${profile.role.toLowerCase()} in Kochi, India, building full-stack web and mobile products end to end.`,
    "",
    "The homepage is an interactive macOS-style desktop. Every page below serves the same portfolio as plain server-rendered HTML, for readers and assistants that do not run JavaScript.",
    "",
    "## Main pages",
    "",
    `- [Home](${absoluteUrl("/")}): Interactive desktop version of the portfolio.`,
    `- [About](${absoluteUrl("/about")}): Background, focus areas and skills.`,
    `- [Projects](${absoluteUrl("/projects")}): Every project and open-source contribution.`,
    `- [Experience](${absoluteUrl("/experience")}): Roles and the products shipped in them.`,
    `- [Contact](${absoluteUrl("/contact")}): Email, GitHub, LinkedIn and résumé.`,
    "",
    "## Project case studies",
    "",
    ...projects.map(
      (project) =>
        `- [${project.name}](${absoluteUrl(projectPath(project.id))}): ${project.description}`
    ),
    "",
    "## Optional",
    "",
    `- [Sitemap](${absoluteUrl("/sitemap.xml")}): Public page index.`,
    `- [Résumé (PDF)](${absoluteUrl(profile.cv)}): Latest CV.`,
  ];

  if (profile.links.github)
    lines.push(`- [GitHub](${profile.links.github}): Public repositories.`);
  if (profile.links.linkedin)
    lines.push(
      `- [LinkedIn](${profile.links.linkedin}): Professional profile.`
    );

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
