import Link from "next/link";
import {
  Chips,
  ExternalLink,
  PageHeader,
  Section,
} from "../../components/site/ui";
import { projectPath, getProjectRecords } from "../../lib/content/archive";
import { formatYearMonthRange } from "../../lib/content/dates";
import { pageMetadata } from "../../lib/content/seo";
import { loadContent } from "../../lib/content/server";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Background, focus areas, and technical skills of Mohammed Javad E, a software developer in Kochi, India.",
  path: "/about",
});

export default async function AboutPage() {
  const content = await loadContent();
  const { profile, skills, experiences } = content;
  const current = experiences.find((experience) => !experience.end);

  return (
    <>
      <PageHeader title={profile.name} lede={profile.summary} />

      {profile.intro.length > 0 && (
        <Section title="Background">
          <div className="max-w-2xl space-y-4 text-16 leading-7">
            {profile.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </Section>
      )}

      <Section title="Focus">
        <Chips items={profile.focus} />
      </Section>

      <Section title="Experience">
        <ul className="space-y-4">
          {experiences.map((experience) => (
            <li key={experience.id} className="max-w-2xl">
              <p className="text-15 font-medium">
                {experience.role} · {experience.company}
              </p>
              <p className="text-13 text-site-muted">
                {formatYearMonthRange(experience.start, experience.end)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-15">
          <Link href="/experience" className="text-site-accent hover:underline">
            Read the full work history
          </Link>
        </p>
      </Section>

      <Section title="Skills">
        <div className="space-y-6">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-13 font-medium text-site-muted">{group}</h3>
              <div className="mt-3">
                <Chips items={items} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Selected projects">
        <ul className="divide-y divide-site-rule border-y border-site-rule">
          {getProjectRecords(content)
            .slice(0, 4)
            .map((project) => (
              <li key={project.id} className="py-4">
                <Link
                  href={projectPath(project.id)}
                  className="text-15 font-medium text-site-accent hover:underline"
                >
                  {project.name}
                </Link>
                <p className="mt-1 max-w-2xl text-15 leading-6 text-site-muted">
                  {project.description}
                </p>
              </li>
            ))}
        </ul>
      </Section>

      <Section title="Links">
        <ul className="space-y-2 text-15">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="text-site-accent hover:underline"
            >
              {profile.email}
            </a>
          </li>
          {profile.links.github && (
            <li>
              <ExternalLink href={profile.links.github}>
                GitHub — {profile.links.github.replace("https://", "")}
              </ExternalLink>
            </li>
          )}
          {profile.links.linkedin && (
            <li>
              <ExternalLink href={profile.links.linkedin}>
                LinkedIn — {profile.links.linkedin.replace("https://", "")}
              </ExternalLink>
            </li>
          )}
          <li>
            <a href={profile.cv} className="text-site-accent hover:underline">
              Résumé (PDF)
            </a>
          </li>
        </ul>
        {current && (
          <p className="mt-6 text-13 text-site-muted">
            Currently {current.role} at {current.company}.
          </p>
        )}
      </Section>
    </>
  );
}
