import { describe, expect, it } from "vitest";
import { shouldPublish } from "../lib/publish";

describe("shouldPublish", () => {
  it("stays empty unless SITE_PUBLISH is exactly 1", () => {
    for (const v of [undefined, "", "0", "true", "yes", "11"]) {
      expect(shouldPublish({ SITE_PUBLISH: v }).publish).toBe(false);
    }
  });
  it("publishes outside Cloudflare when the flag is set", () => {
    expect(shouldPublish({ SITE_PUBLISH: "1" }).publish).toBe(true);
  });
  it("on Cloudflare Pages, only main publishes", () => {
    const base = { SITE_PUBLISH: "1", CF_PAGES: "1" };
    expect(shouldPublish({ ...base, CF_PAGES_BRANCH: "main" }).publish).toBe(true);
    expect(shouldPublish({ ...base, CF_PAGES_BRANCH: "feature/x" }).publish).toBe(false);
  });
  it("on Workers Builds, only main publishes", () => {
    const base = { SITE_PUBLISH: "1", WORKERS_CI: "1" };
    expect(shouldPublish({ ...base, WORKERS_CI_BRANCH: "main" }).publish).toBe(true);
    expect(shouldPublish({ ...base, WORKERS_CI_BRANCH: "preview-123" }).publish).toBe(false);
  });
  it("fails closed when the branch cannot be identified on Cloudflare", () => {
    const d = shouldPublish({ SITE_PUBLISH: "1", CF_PAGES: "1" });
    expect(d.publish).toBe(false);
    expect(d.reason).toContain("desconocida");
  });
  it("does not publish without the flag even on main", () => {
    expect(shouldPublish({ CF_PAGES: "1", CF_PAGES_BRANCH: "main" }).publish).toBe(false);
  });
});
