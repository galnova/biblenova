// src/utils/journal.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * -----------------------------
 * Journal (entries) – existing
 * -----------------------------
 */
const STORAGE_KEY = "journal_v1";

export async function loadJournal() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveJournal(list: any[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function saveJournalEntry(input: { ref: string; text: string; note?: string }) {
  const list = await loadJournal();

  // de-dupe exact ref + text
  const existing = list.find((e: any) => e.ref === input.ref && e.text === input.text);
  if (existing) return existing;

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ref: input.ref,
    text: input.text,
    note: input.note || undefined,
    createdAt: Date.now(),
  };

  await saveJournal([entry, ...list]); // newest first
  return entry;
}

export async function removeJournalEntry(id: string) {
  const list = await loadJournal();
  await saveJournal(list.filter((e: any) => e.id !== id));
}

export async function clearJournal() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * -----------------------------
 * Highlights – new
 * -----------------------------
 * - Stored as a map keyed by verse reference string, e.g. "John 3:16"
 * - Value shape: { color: string, createdAt: number, noteId?: string }
 * - Default color is "yellow" (can be changed later via default-color helpers)
 */
const HIGHLIGHTS_KEY = "highlights_v1";
const HIGHLIGHT_DEFAULT_COLOR_KEY = "highlight_default_color_v1";

type HighlightInfo = {
  color: string;       // e.g., "yellow"
  createdAt: number;   // epoch ms
  noteId?: string;     // optional link to a journal entry
};

export async function loadHighlights(): Promise<Record<string, HighlightInfo>> {
  try {
    const raw = await AsyncStorage.getItem(HIGHLIGHTS_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

export async function saveHighlights(map: Record<string, HighlightInfo>) {
  await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(map));
}

export async function getHighlight(ref: string): Promise<HighlightInfo | undefined> {
  const map = await loadHighlights();
  return map[ref];
}

export async function setHighlight(
  ref: string,
  info?: Partial<HighlightInfo> & { color?: string; noteId?: string }
): Promise<HighlightInfo> {
  const map = await loadHighlights();

  // Use existing entry if present; otherwise create new
  const existing = map[ref];
  const defaultColor = await getDefaultHighlightColor(); // "yellow" by default

  const next: HighlightInfo = {
    color: info?.color || existing?.color || defaultColor,
    createdAt: existing?.createdAt || Date.now(),
    noteId: info?.noteId !== undefined ? info.noteId : existing?.noteId,
  };

  map[ref] = next;
  await saveHighlights(map);
  return next;
}

export async function removeHighlight(ref: string): Promise<void> {
  const map = await loadHighlights();
  if (map[ref]) {
    delete map[ref];
    await saveHighlights(map);
  }
}

/**
 * Link/unlink a journal entry to a highlight (so the app can indicate
 * that a highlighted verse has a note).
 */
export async function linkNoteToHighlight(ref: string, noteId: string): Promise<HighlightInfo | undefined> {
  const map = await loadHighlights();
  const h = map[ref];
  if (!h) return undefined;
  h.noteId = noteId;
  await saveHighlights(map);
  return h;
}

export async function unlinkNoteFromHighlight(ref: string): Promise<HighlightInfo | undefined> {
  const map = await loadHighlights();
  const h = map[ref];
  if (!h) return undefined;
  delete h.noteId;
  await saveHighlights(map);
  return h;
}

/**
 * Default highlight color controls (future Settings integration)
 * - Current default: "yellow"
 * - You can later expose a Settings control to update this.
 */
export async function getDefaultHighlightColor(): Promise<string> {
  try {
    const val = await AsyncStorage.getItem(HIGHLIGHT_DEFAULT_COLOR_KEY);
    return val || "yellow";
  } catch {
    return "yellow";
  }
}

export async function setDefaultHighlightColor(color: string): Promise<void> {
  await AsyncStorage.setItem(HIGHLIGHT_DEFAULT_COLOR_KEY, color);
}

/**
 * Default export (keep existing shape + new helpers)
 */
export default {
  // journal
  loadJournal,
  saveJournal,
  saveJournalEntry,
  removeJournalEntry,
  clearJournal,

  // highlights
  loadHighlights,
  saveHighlights,
  getHighlight,
  setHighlight,
  removeHighlight,
  linkNoteToHighlight,
  unlinkNoteFromHighlight,

  // default color
  getDefaultHighlightColor,
  setDefaultHighlightColor,
};
