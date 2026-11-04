"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Profile } from "../../lib/content/schema";

const navigation = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Work" },
  { href: "/experience", label: "Archive" },
  { href: "/contact", label: "Contact" },
];

export default function MobilePortfolio({ profile }: { profile: Profile }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="phone-portfolio">
      <header className="phone-portfolio-header">
        <Link href="/" className="phone-portfolio-name">
          {profile.name}
        </Link>
        <button
          type="button"
          className="phone-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="phone-portfolio-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {menuOpen ? (
        <main
          className="phone-menu-view"
          id="phone-portfolio-menu"
          aria-label="Portfolio menu"
        >
          <section className="phone-profile">
            <p className="phone-profile-name">{profile.name}</p>
            <h1>{profile.role}</h1>
            <p className="phone-profile-summary">{profile.summary}</p>
          </section>

          <nav className="phone-portfolio-nav" aria-label="Portfolio sections">
            {navigation.map(({ href, label }, index) => (
              <Link
                key={label}
                href={href}
                className={label === "Index" ? "is-current" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="phone-nav-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{label}</span>
                <span className="phone-nav-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </nav>
        </main>
      ) : (
        <main className="phone-index" aria-label="Portfolio home">
          <div className="phone-portrait-wrap">
            <div className="phone-portrait">
              <Image
                src="/photo_2026-11-04_13-32-43.jpg"
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 767px) 48vw, 190px"
                className="phone-portrait-image"
              />
            </div>
          </div>
          <h1 className="phone-display-name">{profile.name}</h1>
        </main>
      )}
    </div>
  );
}
