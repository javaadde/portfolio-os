import { describe, expect, it } from "vitest";
import data from "../../data/portfolio.json";
import { parsePortfolio } from "./content/schema";
import {
  buildFileEntries,
  listLocation,
  getLocationTitle,
} from "./file-system";
import {
  buildSearchIndex,
  searchIndex,
} from "../components/spotlight/search-index";

const content = parsePortfolio(data);
const entries = buildFileEntries(content);
const state = { trashed: [], isVisible: () => true };

describe("open-source contributions", () => {
  it("exposes the section on the desktop and its contribution in Finder", () => {
    expect(getLocationTitle("contributions", content.profile.username)).toBe(
      "Open Source"
    );
    expect(
      listLocation("desktop", entries, content.profile.username, state).some(
        (e) => e.id === "contributions"
      )
    ).toBe(true);
    const [contribution] = listLocation(
      "contributions",
      entries,
      content.profile.username,
      state
    );
    expect(contribution.open).toEqual({
      type: "app",
      app: "notes",
      payload: "rust-cc-rs-1833",
    });
    expect(contribution.info?.link).toBe(
      "https://github.com/rust-lang/cc-rs/pull/1833"
    );
  });
  it("finds Rust contributions through Spotlight and tags", () => {
    expect(searchIndex(buildSearchIndex(content), "cc-rs")[0].target).toEqual({
      type: "app",
      app: "notes",
      payload: "rust-cc-rs-1833",
    });
    expect(
      listLocation("tag:Rust", entries, content.profile.username, state).some(
        (e) => e.id === "rust-cc-rs-1833"
      )
    ).toBe(true);
  });
});
