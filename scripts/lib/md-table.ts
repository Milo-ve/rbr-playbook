export interface MdTable {
  headers: string[];
  rows: Record<string, string>[];
}

/** Removes the markdown a table cell can carry, leaving plain text. */
export function stripMd(cell: string): string {
  return cell
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\\\|/g, "|")
    .trim();
}

function splitRow(line: string): string[] {
  const body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  // Split on pipes that are not escaped.
  return body.split(/(?<!\\)\|/).map((c) => c.trim());
}

/** Reads every pipe table in a markdown document, keyed by its header names. */
export function parseTables(markdown: string): MdTable[] {
  const tables: MdTable[] = [];
  const lines = markdown.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    const sep = lines[i + 1] ?? "";
    if (line.trim().startsWith("|") && /^\s*\|[\s:|-]+\|\s*$/.test(sep)) {
      const headers = splitRow(line).map(stripMd);
      const rows: Record<string, string>[] = [];
      i += 2;
      while (i < lines.length && (lines[i] ?? "").trim().startsWith("|")) {
        const cells = splitRow(lines[i] as string);
        const row: Record<string, string> = {};
        headers.forEach((h, k) => {
          row[h] = stripMd(cells[k] ?? "");
        });
        rows.push(row);
        i += 1;
      }
      tables.push({ headers, rows });
    } else {
      i += 1;
    }
  }
  return tables;
}

/** First table whose headers include every given name. */
export function findTable(
  tables: MdTable[],
  ...names: string[]
): MdTable | undefined {
  return tables.find((t) => names.every((n) => t.headers.includes(n)));
}
