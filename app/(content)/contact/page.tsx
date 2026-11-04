import { ExternalLink, PageHeader } from "../../components/site/ui";
import { pageMetadata } from "../../lib/content/seo";
import { loadContent } from "../../lib/content/server";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Mohammed Javad E by email, GitHub, or LinkedIn, and download the latest résumé.",
  path: "/contact",
});

export default async function ContactPage() {
  const content = await loadContent();
  const { profile } = content;

  const links: { label: string; href: string }[] = [];
  if (profile.links.github)
    links.push({ label: "GitHub", href: profile.links.github });
  if (profile.links.linkedin)
    links.push({ label: "LinkedIn", href: profile.links.linkedin });

  return (
    <>
      <PageHeader
        title="Contact"
        lede={`${profile.role} based in Kochi, India. The fastest way to reach me is email.`}
      />

      <dl className="mt-12 divide-y divide-site-rule border-y border-site-rule">
        <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
          <dt className="w-24 shrink-0 text-13 text-site-muted">Email</dt>
          <dd className="text-17">
            <a
              href={`mailto:${profile.email}`}
              className="text-site-accent hover:underline"
            >
              {profile.email}
            </a>
          </dd>
        </div>

        {links.map((link) => (
          <div
            key={link.label}
            className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <dt className="w-24 shrink-0 text-13 text-site-muted">
              {link.label}
            </dt>
            <dd className="text-17">
              <ExternalLink href={link.href}>
                {link.href
                  .replace(/^https?:\/\/(www\.)?/, "")
                  .replace(/\/$/, "")}
              </ExternalLink>
            </dd>
          </div>
        ))}

        <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
          <dt className="w-24 shrink-0 text-13 text-site-muted">Résumé</dt>
          <dd className="text-17">
            <a href={profile.cv} className="text-site-accent hover:underline">
              Download CV (PDF)
            </a>
          </dd>
        </div>
      </dl>

      <p className="mt-10 max-w-2xl text-15 leading-6 text-site-muted">
        {profile.summary}
      </p>
    </>
  );
}
