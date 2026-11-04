import Link from "next/link";
import { Chips, PageHeader, Section } from "../../components/site/ui";
import { projectPath } from "../../lib/content/archive";
import { formatYearMonthRange } from "../../lib/content/dates";
import { pageMetadata } from "../../lib/content/seo";
import { loadContent } from "../../lib/content/server";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Work history of Mohammed Javad — roles at Bytsolv and Devxtra, and the products shipped in each one.",
  path: "/experience",
});

export default async function ExperiencePage() {
  const content = await loadContent();

  return (
    <>
      <PageHeader
        title="Experience"
        lede="Roles, responsibilities, and the products shipped in them."
      />

      <div className="mt-12 space-y-12">
        {content.experiences.map((experience) => {
          const projects = experience.projects.filter(
            (project) => typeof project !== "string"
          );

          return (
            <article
              key={experience.id}
              className="border-t border-site-rule pt-10 first:border-t-0 first:pt-0"
            >
              <h2 className="text-24 font-semibold tracking-tight">
                {experience.company}
              </h2>
              <p className="mt-1 text-15">{experience.role}</p>
              <p className="mt-0.5 text-13 text-site-muted">
                {formatYearMonthRange(experience.start, experience.end)}
              </p>
              <p className="mt-4 max-w-2xl text-16 leading-7">
                {experience.description}
              </p>

              {projects.length > 0 && (
                <>
                  <h3 className="mt-8 text-13 font-medium text-site-muted">
                    Products
                  </h3>
                  <ul className="mt-3 space-y-5">
                    {projects.map((project) => (
                      <li key={project.id}>
                        <p className="text-15 font-medium">
                          <Link
                            href={projectPath(project.id)}
                            className="hover:text-site-accent"
                          >
                            {project.name}
                          </Link>
                          {project.type && (
                            <span className="ml-2 text-13 font-normal text-site-muted">
                              {project.type}
                            </span>
                          )}
                        </p>
                        <p className="mt-1 max-w-2xl text-15 leading-6 text-site-muted">
                          {project.description}
                        </p>
                        <div className="mt-2">
                          <Chips items={project.tags} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </article>
          );
        })}
      </div>

      {content.awards.length > 0 && (
        <Section title="Highlights">
          <ul className="divide-y divide-site-rule border-y border-site-rule">
            {content.awards.map((award) => (
              <li key={award.title} className="py-5">
                <p className="text-15 font-medium">{award.title}</p>
                <p className="mt-0.5 text-13 text-site-muted">
                  {award.event} · {award.date}
                </p>
                <p className="mt-2 max-w-2xl text-15 leading-6">
                  {award.description}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
