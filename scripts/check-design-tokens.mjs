import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

const palettePattern =
  /\b(?:bg|text|border|ring|from|to|via|stroke|fill)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
const literalColorPattern = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      if (EXTENSIONS.has(path.extname(entry.name))) {
        return [fullPath];
      }
      return [];
    }),
  );

  return files.flat();
}

function collectLineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function checkFile(filePath, source) {
  const problems = [];

  for (const match of source.matchAll(palettePattern)) {
    const value = match[0];
    const line = collectLineNumber(source, match.index ?? 0);
    problems.push(`${filePath}:${line} uses disallowed Tailwind palette class "${value}"`);
  }

  for (const match of source.matchAll(literalColorPattern)) {
    const value = match[0];
    const line = collectLineNumber(source, match.index ?? 0);
    problems.push(`${filePath}:${line} uses disallowed literal color token "${value}"`);
  }

  return problems;
}

async function main() {
  const files = await walk(ROOT);
  const allProblems = [];

  for (const filePath of files) {
    const source = await readFile(filePath, "utf8");
    allProblems.push(...checkFile(filePath, source));
  }

  if (allProblems.length > 0) {
    console.error("Design token guard failed:");
    for (const problem of allProblems) {
      console.error(`- ${problem}`);
    }
    process.exit(1);
  }

  console.log("Design token guard passed.");
}

await main();
