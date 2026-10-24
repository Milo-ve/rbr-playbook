/**
 * Reads the "Efecto sobre las tareas" table of a variant file.
 * Rows look like: | T036 | condicional | motivo |
 * Returns taskId -> reason for every `condicional` row.
 */
export function parseConditionals(markdown: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    const c = line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((x) => x.trim());
    if (!/^T\d{3}$/.test(c[0] ?? "")) continue;
    if (c[1] === "condicional") out.set(c[0] as string, c[2] ?? "");
  }
  return out;
}
