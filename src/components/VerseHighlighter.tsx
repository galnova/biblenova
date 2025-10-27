import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Share, StyleSheet } from "react-native";
import { saveJournalEntry } from "../utils/journal";

export type Verse = { verse: number; text: string };

type Props = {
  book: string;
  chapter: number;
  verses: Verse[]; // array like [{verse:1,text:"..."}, ...]
};

export default function VerseHighlighter({ book, chapter, verses }: Props) {
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);

  const lo = start == null ? null : Math.min(start, end ?? start);
  const hi = start == null ? null : Math.max(start, end ?? start);

  const selected = useMemo(() => {
    if (lo == null || hi == null) return [];
    return verses.filter(v => v.verse >= lo && v.verse <= hi);
  }, [lo, hi, verses]);

  const refStr = useMemo(() => {
    if (lo == null || hi == null) return "";
    return `${book} ${chapter}:${lo}${hi > lo ? `–${hi}` : ""}`;
  }, [book, chapter, lo, hi]);

  const selectedText = selected.map(v => `(${v.verse}) ${v.text.trim()}`).join(" ");

  // handlers used by the JSX below:
  const begin = (vNum: number) => { setStart(vNum); setEnd(null); };
  const extend = (vNum: number) => { if (start != null) setEnd(vNum); };
  const cancel = () => { setStart(null); setEnd(null); };
  const onShare = async () => { if (refStr) { try { await Share.share({ message: `${refStr}\n${selectedText}` }); } catch {} } };
  const onSave = async () => { if (refStr) { await saveJournalEntry({ ref: refStr, text: selectedText }); cancel(); } };

  const hasSelection = start != null;

  return (
    <View style={{ flex: 1 }}>
      {hasSelection && (
        <View style={styles.toolbar}>
          <Text style={styles.toolbarRef}>{refStr}</Text>
          <View style={styles.toolbarRow}>
            <Pressable style={[styles.action, styles.primary]} onPress={onSave}>
              <Text style={styles.actionLabel}>Save to Journal</Text>
            </Pressable>
            <Pressable style={[styles.action, styles.secondary]} onPress={onShare}>
              <Text style={styles.actionLabel}>Share</Text>
            </Pressable>
            <Pressable style={[styles.action, styles.ghost]} onPress={cancel}>
              <Text style={styles.actionLabel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.versesWrap}>
        {verses.map(v => {
          const isSelected = lo != null && hi != null && v.verse >= lo && v.verse <= hi;
          return (
            <Pressable
              key={v.verse}
              onLongPress={() => begin(v.verse)}
              onPress={() => extend(v.verse)}
              delayLongPress={250}
              style={[styles.verseRow, isSelected && styles.verseSelected]}
            >
              <Text style={styles.vNum}>{v.verse}</Text>
              <Text style={styles.vText}>{v.text}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: "#111827",
    borderBottomColor: "#1f2937",
    borderBottomWidth: 1,
    padding: 10,
    gap: 8,
  },
  toolbarRef: { color: "#93c5fd", fontWeight: "700", marginBottom: 4 },
  toolbarRow: { flexDirection: "row", gap: 8 },
  action: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  actionLabel: { color: "#e5e7eb", fontWeight: "600" },
  primary: { backgroundColor: "#2563eb" },
  secondary: { backgroundColor: "#374151" },
  ghost: { backgroundColor: "#111827", borderWidth: 1, borderColor: "#374151" },

  versesWrap: { padding: 12, gap: 10, backgroundColor: "#0d0d0d" },
  verseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#0d0d0d",
    borderColor: "#1f2937",
    borderWidth: 1,
  },
  verseSelected: { backgroundColor: "#0b1320", borderColor: "#2563eb" },
  vNum: { color: "#93c5fd", width: 28, fontWeight: "700" },
  vText: { color: "#e5e7eb", flex: 1, lineHeight: 20 },
});
