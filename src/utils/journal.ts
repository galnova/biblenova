// src/utils/journal.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type JournalEntry = {
  id: string;
  ref: string;       // e.g., "John 3:16" or "John 3"
  text: string;      // verse(s) text
  createdAt: number; // epoch ms
};

const STORAGE_KEY = "journal_v1";

/** Load all entries (newest first). */
export async function loadJournal(): Promise<JournalEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

/** Save whole list back to storage. */
export async function saveJournal(list: JournalEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** Append a single entry (returns the new or existing entry). */
export async function saveJournalEntry(input: { ref: string; text: string }): Promise<JournalEntry> {
  const list = await loadJournal();

  // de-dupe by exact ref+text
  const existing = list.find(e => e.ref === input.ref && e.text === input.text);
  if (existing) return existing;

  const entry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ref: input.ref,
    text: input.text,
    createdAt: Date.now(),
  };

  const next = [entry, ...list]; // newest first
  await saveJournal(next);
  return entry;
}

/** Remove entry by id. */
export async function removeJournalEntry(id: string): Promise<void> {
  const list = await loadJournal();
  const next = list.filter(e => e.id !== id);
  await saveJournal(next);
}

/** Optional: clear everything. */
export async function clearJournal(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/* Default export (so both `import {...}` and `import Journal` work) */
const Journal = {
  loadJournal,
  saveJournal,
  saveJournalEntry,
  removeJournalEntry,
  clearJournal,
};
export default Journal;
