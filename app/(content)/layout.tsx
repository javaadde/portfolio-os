import React from "react";
import SiteShell from "../components/site/site-shell";
import { loadContent } from "../lib/content/server";

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await loadContent();

  return <SiteShell profile={content.profile}>{children}</SiteShell>;
}
