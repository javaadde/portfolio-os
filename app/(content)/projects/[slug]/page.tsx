import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/site/json-ld";
import { Chips, ExternalLink, Section } from "../../../components/site/ui";
import {
  getProjectRecord,
  getProjectRecords,
  projectPath,
} from "../../../lib/content/archive";
import { formatYearMonthRange } from "../../../lib/content/dates";
import { pageMetadata, projectJsonLd } from "../../../lib/content/seo";
import { loadContent } from "../../../lib/content/server";

export const dynamicParams = false;

export async function generateStaticParams() {
  const content = await loadContent();
  return getProjectRecords(content).map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const content = await loadContent();
  const project = getProjectRecord(content, params.slug);
  if (!project) return {};

  const metadata = pageMetadata({
    title: `${project.name} case study`,
    description: project.description,
    path: projectPath(project.id),
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      title: `${project.name} — case study`,
      description: project.description,
      url: projectPath(project.id),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const content = await loadContent();
  const project = getProjectRecord(content, params.slug);
  if (!project) notFound();

  const context = project.contexts[0];
  const caseStudy = project.caseStudy;
  const others = getProjectRecords(content).filter(
    (record) => record.id !== project.id
  );

  return (
    <article>
      <JsonLd data={projectJsonLd(project, content)} />

      <nav aria-label="Breadcrumb" className="text-13 text-site-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/projects" className="hover:text-site-fg">
              Projects
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-site-fg">
            {project.name}
          </li>
        </ol>
      </nav>

      <header className="mt-6 border-b border-site-rule pb-10">
        <h1 className="text-36 font-semibold leading-[1.1] tracking-tight">
          {project.name}
        </h1>
        {(project.tagline || context) && (
          <p className="mt-3 text-15 text-site-muted">
            {[project.tagline, context?.company].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-6 max-w-2xl text-17 leading-7">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-15">
          {project.link && (
            <ExternalLink href={project.link}>Live site</ExternalLink>
          )}
          {project.github && (
            <ExternalLink href={project.github}>Source code</ExternalLink>
          )}
        </div>

        <dl className="mt-8 grid gap-3 text-13 sm:grid-cols-2">
          {context && (
            <div>
              <dt className="text-site-muted">Built at</dt>
              <dd className="mt-0.5">
                {context.company} — {context.role}
              </dd>
            </div>
          )}
          {context && (
            <div>
              <dt className="text-site-muted">When</dt>
              <dd className="mt-0.5">
                {formatYearMonthRange(context.start, context.end)}
              </dd>
            </div>
          )}
          {project.role && !context && (
            <div>
              <dt className="text-site-muted">Role</dt>
              <dd className="mt-0.5">{project.role}</dd>
            </div>
          )}
          {project.tags.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-site-muted">Stack</dt>
              <dd className="mt-2">
                <Chips items={project.tags} />
              </dd>
            </div>
          )}
        </dl>
      </header>

      {caseStudy?.problem && (
        <Section title="Problem">
          <p className="max-w-2xl text-16 leading-7">{caseStudy.problem}</p>
        </Section>
      )}

      {(caseStudy?.role || project.role) && (
        <Section title="My role">
          <p className="max-w-2xl text-16 leading-7">
            {caseStudy?.role ?? project.role}
          </p>
        </Section>
      )}

      {caseStudy?.architecture && (
        <Section title="Architecture">
          <p className="max-w-2xl text-16 leading-7">
            {caseStudy.architecture}
          </p>
        </Section>
      )}

      {caseStudy && caseStudy.challenges.length > 0 && (
        <Section title="Engineering challenges">
          <ul className="max-w-2xl list-disc space-y-3 pl-5 text-16 leading-7 marker:text-site-muted">
            {caseStudy.challenges.map((challenge) => (
              <li key={challenge.slice(0, 32)}>{challenge}</li>
            ))}
          </ul>
        </Section>
      )}

      {caseStudy && caseStudy.outcomes.length > 0 && (
        <Section title="Outcomes">
          <ul className="max-w-2xl list-disc space-y-3 pl-5 text-16 leading-7 marker:text-site-muted">
            {caseStudy.outcomes.map((outcome) => (
              <li key={outcome.slice(0, 32)}>{outcome}</li>
            ))}
          </ul>
        </Section>
      )}

      {others.length > 0 && (
        <Section title="Other projects">
          <ul className="divide-y divide-site-rule border-y border-site-rule">
            {others.map((other) => (
              <li key={other.id} className="py-4">
                <Link
                  href={projectPath(other.id)}
                  className="text-15 font-medium text-site-accent hover:underline"
                >
                  {other.name}
                </Link>
                <p className="mt-1 max-w-2xl text-15 leading-6 text-site-muted">
                  {other.description}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
