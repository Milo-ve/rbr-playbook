export type FrontmatterValue = string | boolean | null;
export type Frontmatter = Record<string, FrontmatterValue>;

/**
 * Parses the flat `key: value` block between the leading `---` fences.
 * Intentionally not full YAML: the playbook only uses scalars.
 */
export function parseFrontmatter(text: string): Frontmatter | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) return null;
  const out: Frontmatter = {};
  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    out[kv[1] as string] = parseScalar((kv[2] ?? "").trim());
  }
  return out;
}

function parseScalar(raw: string): FrontmatterValue {
  if (raw === "") return null;
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (
    raw.length >= 2 &&
    ((raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'")))
  ) {
    return raw.slice(1, -1);
  }
  return raw;
}
