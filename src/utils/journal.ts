import AsyncStorage from "@react-native-async-storage/async-storage";

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

export async function saveJournal(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function saveJournalEntry(input) {
  const list = await loadJournal();

  // de-dupe exact ref + text
  const existing = list.find((e) => e.ref === input.ref && e.text === input.text);
  if (existing) return existing;

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ref: input.ref,
    text: input.text,
    createdAt: Date.now(),
  };

  await saveJournal([entry, ...list]); // newest first
  return entry;
}

export async function removeJournalEntry(id) {
  const list = await loadJournal();
  await saveJournal(list.filter((e) => e.id !== id));
}

export async function clearJournal() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export default {
  loadJournal,
  saveJournal,
  saveJournalEntry,
  removeJournalEntry,
  clearJournal,
};
