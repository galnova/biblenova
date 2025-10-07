/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

// ✅ All 66 books with chapter counts
const bibleBooks = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 },
  { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 },
  { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 },
  { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 },
  { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 },
  { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 },
  { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 },
  { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 },
  { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 },
  { name: "2 Corinthians", chapters: 13 },
  { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 },
  { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 },
  { name: "2 Thessalonians", chapters: 3 },
  { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 },
  { name: "Titus", chapters: 3 },
  { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 },
  { name: "James", chapters: 5 },
  { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 },
  { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 },
  { name: "Jude", chapters: 1 },
  { name: "Revelation", chapters: 22 },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Where JSON files will live inside the app bundle
const OUT_DIR = path.resolve(__dirname, "../assets/bible/kjv");
// Where the generated index (static requires) will be written
const INDEX_FILE = path.resolve(__dirname, "../src/data/bibleIndex.ts");

// polite delay between requests
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ensureDir(p: string) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function fetchChapter(book: string, chapter: number) {
  const q = encodeURIComponent(`${book} ${chapter}`);
  const url = `https://bible-api.com/${q}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${book} ${chapter}`);
  const json = await res.json();
  return {
    book,
    chapter,
    verses: (json.verses || []).map((v: any) => ({
      verse: v.verse,
      text: (v.text || "").trim(),
    })),
    translation: json.translation_name || "KJV",
  };
}

async function main() {
  await ensureDir(OUT_DIR);

  const requires: string[] = [];
  requires.push("// AUTO-GENERATED. DO NOT EDIT BY HAND.");
  requires.push("/* eslint-disable @typescript-eslint/no-var-requires */");
  requires.push(
    "export type ChapterData = { book: string; chapter: number; verses: {verse:number; text:string}[]; translation: string };"
  );
  requires.push(
    "export const bibleIndex: Record<string, Record<number, ChapterData>> = {"
  );

  for (const b of bibleBooks) {
    const bookDir = path.join(OUT_DIR, b.name);
    await ensureDir(bookDir);
    console.log(`\n=== ${b.name} (${b.chapters} chapters) ===`);
    requires.push(`  "${b.name}": {`);

    for (let c = 1; c <= b.chapters; c++) {
      const filePath = path.join(bookDir, `${c}.json`);
      if (!fs.existsSync(filePath)) {
        try {
          const data = await fetchChapter(b.name, c);
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            "utf8"
          );
          console.log(`Saved ${b.name} ${c}`);
          await sleep(250); // polite delay
        } catch (e: any) {
          console.warn(`Failed ${b.name} ${c}: ${e.message}`);
        }
      } else {
        console.log(`Skip (exists) ${b.name} ${c}`);
      }
      const rel = `../assets/bible/kjv/${b.name}/${c}.json`;
      requires.push(`    ${c}: require("${rel}"),`);
    }
    requires.push("  },");
  }

  requires.push("};");
  await fs.promises.writeFile(INDEX_FILE, requires.join("\n"), "utf8");
  console.log(`\n✅ Wrote index: ${path.relative(process.cwd(), INDEX_FILE)}`);
  console.log("✅ All done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
