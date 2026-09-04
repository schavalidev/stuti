// Aggregates the sahasranāma name-lists, each shipped as its own module
// (see design_handoff_stuti/README.md — these three used to merge onto a
// shared window.STUTI_NAMES object at load time).
import { vishnu } from "./stuti-names-vishnu";
import { lalita } from "./stuti-names-lalita";
import { ganesha } from "./stuti-names-ganesha";

export const STUTI_NAMES: Record<string, any> = { vishnu, lalita, ganesha };

/* Per-śloka name counts for a registry that has them (`slokaCounts`) — how
   many of its names each śloka carries — turned into a from/to range for
   a given śloka number. Shared by every registry that carries the field;
   installed once here rather than duplicated per file. */
export function range(key: string, slokaN: number) {
  const N = (STUTI_NAMES as any)[key], c = N && N.slokaCounts;
  if (!c) return null;
  const i = parseInt(String(slokaN), 10);
  if (!i || i < 1 || i > c.length) return null;
  let from = 1;
  for (let k = 0; k < i - 1; k++) from += c[k];
  return { from: from, to: from + c[i - 1] - 1 };
}
