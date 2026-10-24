export const MARKS = {
  pendiente: "[ ]",
  "en-curso": "[~]",
  hecha: "[x]",
  "no-aplica": "[-]",
} as const;

export type MarkName = keyof typeof MARKS;

const ROW = /^\| \[[ ~x-]\] \| (T\d{3}|[A-Z]+-\d{3}) \|/;

/**
 * Sets the status mark of one task row in `tareas-del-evento.md`.
 * When a note is given it is appended to the row's Nota column after " · ".
 * Throws if the task id is not found, so a typo never passes silently.
 */
export function markTask(
  markdown: string,
  id: string,
  mark: MarkName,
  note?: string,
): string {
  let found = false;
  const lines = markdown.split("\n").map((line) => {
    const m = ROW.exec(line);
    if (!m || m[1] !== id) return line;
    found = true;
    let out = line.replace(/^\| \[[ ~x-]\]/, `| ${MARKS[mark]}`);
    if (note) {
      const clean = note.replace(/\|/g, "\\|").trim();
      // The Nota column is the last cell: "... | <nota> |".
      out = out.replace(/\|\s*([^|]*?)\s*\|\s*$/, (_all, prev: string) => {
        const joined = prev.trim() === "" ? clean : `${prev.trim()} · ${clean}`;
        return `| ${joined} |`;
      });
    }
    return out;
  });
  if (!found)
    throw new Error(`No existe la tarea ${id} en la lista del evento`);
  return lines.join("\n");
}

export function summarize(markdown: string): Record<MarkName, number> {
  const counts: Record<MarkName, number> = {
    pendiente: 0,
    "en-curso": 0,
    hecha: 0,
    "no-aplica": 0,
  };
  for (const line of markdown.split("\n")) {
    const m = /^\| (\[[ ~x-]\]) \| T\d{3} \|/.exec(line);
    if (!m) continue;
    const name = (Object.keys(MARKS) as MarkName[]).find(
      (k) => MARKS[k] === m[1],
    );
    if (name) counts[name] += 1;
  }
  return counts;
}
