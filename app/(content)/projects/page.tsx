import Link from "next/link";
import {
  Chips,
  ExternalLink,
  PageHeader,
  Section,
} from "../../components/site/ui";
import type { ProjectRecord } from "../../lib/content/archive";
import { getProjectRecords, projectPath } from "../../lib/content/archive";
import { pageMetadata } from "../../lib/content/seo";
import { loadContent } from "../../lib/content/server";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Engineering case studies for the web, desktop, and mobile projects built by Mohammed Javad E, with stack details and links to live sites and source code.",
  path: "/projects",
});

const ProjectListItem: React.FC<{ project: ProjectRecord }> = ({ project }) => {
  const context = project.contexts[0];

  return (
    <li className="py-7 first:pt-0 last:pb-0">
      <article>
        <h2 className="text-20 font-semibold tracking-tight">
          <Link
            href={projectPath(project.id)}
            className="hover:text-site-accent"
          >
            {project.name}
          </Link>
        </h2>
        {(project.tagline || context) && (
          <p className="mt-1 text-13 text-site-muted">
            {[project.tagline, context?.company].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-2 max-w-2xl text-15 leading-6">
          {project.description}
        </p>
        <div className="mt-3">
          <Chips items={project.tags} />
        </div>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-13">
          <Link
            href={projectPath(project.id)}
            className="text-site-accent hover:underline"
          >
            Read the case study
          </Link>
          {project.link && (
            <ExternalLink href={project.link}>Live site</ExternalLink>
          )}
          {project.github && (
            <ExternalLink href={project.github}>Source</ExternalLink>
          )}
        </p>
      </article>
    </li>
  );
};

export default async function ProjectsPage() {
  const content = await loadContent();
  const projects = getProjectRecords(content);
  const work = projects.filter((project) => project.contexts.length > 0);
  const independent = projects.filter(
    (project) => project.contexts.length === 0
  );

  return (
    <>
      <PageHeader
        title="Projects"
        lede="Case studies for the products and tools I've built — what each one does, the stack behind it, and where to find the code or the live site."
      />

      {work.length > 0 && (
        <Section title="Built at work">
          <ul className="divide-y divide-site-rule border-b border-site-rule">
            {work.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </ul>
        </Section>
      )}

      {independent.length > 0 && (
        <Section title="Independent projects">
          <ul className="divide-y divide-site-rule border-b border-site-rule">
            {independent.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </ul>
        </Section>
      )}

      {content.contributions.length > 0 && (
        <Section title="Open source contributions">
          <ul className="divide-y divide-site-rule border-b border-site-rule">
            {content.contributions.map((contribution) => (
              <li key={contribution.id} className="py-6">
                <h3 className="text-15 font-medium">
                  <ExternalLink href={contribution.link}>
                    {contribution.repository} #{contribution.number}
                  </ExternalLink>{" "}
                  <span className="text-13 font-normal text-site-muted">
                    {contribution.status}
                  </span>
                </h3>
                <p className="mt-1 text-15">{contribution.title}</p>
                <p className="mt-1 max-w-2xl text-15 leading-6 text-site-muted">
                  {contribution.description}
                </p>
                <div className="mt-3">
                  <Chips items={contribution.tags} />
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
