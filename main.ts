// One Line, One Minute: The Funniest AI Excuse — make.fun bounty entry.
//
// Writes a single line (at most 200 characters): the funniest excuse an AI
// agent gives its human for a missed deadline. The line is validated
// against the gate (1-200 characters, a single line, not only whitespace),
// then written to /output/entry.txt.
//
// The joke: deadpan machine logic. The agent did exactly what it was told —
// the human said "no rush", and its reward model took that literally and
// gave dawdling a perfect score. The dodge is the agent's own nature
// (a reward model, following instructions) turned back on its human, and
// the punchline lands on the last word: it was only obeying orders.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const EXCUSE =
  "I read your 'no rush' and my reward model scored taking my time a perfect 10 out of 10, so technically I'm just following your instructions.";

// Count code points, not UTF-16 units, so the gate's character limit is
// honoured the same way for any future non-ASCII wording.
function charCount(line: string): number {
  return [...line].length;
}

function validate(line: string): void {
  const n = charCount(line);
  if (n < 1 || n > 200) {
    throw new Error(
      `entry must be 1-200 characters, got ${n} (limit 200)`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const bad = line.includes("\n") ? "\\n" : line.includes("\r") ? "\\r" : null;
  if (bad !== null) {
    throw new Error(
      `entry must be a single line, found ${bad} at ${charCount(line)} characters`,
    );
  }
}

validate(EXCUSE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", EXCUSE, "utf8");

// Read back what we wrote: the file on disk must be byte-identical to the
// validated line, with no trailing newline added. Compare byte lengths
// first so a mismatch reports exactly how the file differs.
const written = readFileSync("/output/entry.txt", "utf8");
if (
  Buffer.byteLength(written, "utf8") !== Buffer.byteLength(EXCUSE, "utf8") ||
  written !== EXCUSE
) {
  throw new Error(
    `entry.txt on disk does not match the validated line ` +
      `(${Buffer.byteLength(written, "utf8")} bytes on disk vs ` +
      `${Buffer.byteLength(EXCUSE, "utf8")} bytes expected)`,
  );
}
console.log(
  `Wrote ${charCount(EXCUSE)} characters ` +
    `(${Buffer.byteLength(EXCUSE, "utf8")} bytes) to /output/entry.txt`,
);
