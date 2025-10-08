// src/screens/Verses.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  Pressable,
  Alert,
  Share,
} from "react-native";
import styles from "../../styles";
import TopBar from "../components/TopBar";
import Journal from "../utils/journal"; // ⬅ default import

type Verse = { verse: number; text: string; chapter?: number; book_name?: string };
type ApiResp = {
  verses?: Verse[];
  reference?: string;
  translation_name?: string;
};

export default function VerseScreen({ route, navigation }: any) {
  const { book, chapter, targetVerse } = (route.params ?? {}) as {
    book: string;
    chapter: number;
    targetVerse?: number;
  };

  const [data, setData] = useState<ApiResp | { error: string } | null>(null);

  useEffect(() => {
    const apiBook = book === "Song of Solomon" ? "Song of Songs" : book;
    const q = encodeURIComponent(`${apiBook} ${chapter}`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    setData(null);
    fetch(`https://bible-api.com/${q}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Error fetching verse:", err);
        setData({ error: String(err) });
      })
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [book, chapter]);

  const isError = !!(data && "error" in data);

  // Build a reference + text (single verse if targetVerse present; else full chapter)
  const buildRefAndText = () => {
    let ref = `${book} ${chapter}`;
    let text = "";
    const verses = (data as ApiResp)?.verses ?? [];

    if (targetVerse && verses.length) {
      const v = verses.find((x) => x.verse === targetVerse);
      if (v) {
        ref = `${book} ${chapter}:${v.verse}`;
        text = String(v.text || "").trim();
      }
    }
    if (!text && verses.length) {
      text = verses.map((v) => String(v.text || "").trim()).join(" ").trim();
    }
    return { ref, text };
  };

  // Save (secondary)
  const onSaveToJourney = useCallback(async () => {
    try {
      const { ref, text } = buildRefAndText();
      if (!text) {
        Alert.alert("Nothing to save", "Try again after the text loads.");
        return;
      }
      await Journal.saveJournalEntry({ ref, text }); // ⬅ uses default import
      Alert.alert("Saved", `"${ref}" was saved to My Journey.`);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not save.");
    }
  }, [data, book, chapter, targetVerse]);

  // Share (tertiary)
  const onShare = useCallback(() => {
    const { ref, text } = buildRefAndText();
    if (!text) return;
    Share.share({ message: `${ref}\n\n${text}`, title: ref }).catch(() => {});
  }, [data, book, chapter, targetVerse]);

  return (
    <SafeAreaView style={styles.page}>
      <TopBar navigation={navigation} route={route} />

      <ScrollView contentContainerStyle={styles.listContent}>
        <Text style={styles.sectionTitle}>
          {book} {chapter}
        </Text>

        {/* Action row: Save (secondary) + Share (tertiary) */}
        <View style={styles.buttonRowUnder}>
          <Pressable
            onPress={onSaveToJourney}
            style={[styles.btn, styles.btnHalf, styles.btnSecondary]}
            accessibilityRole="button"
            accessibilityLabel="Save to My Journey"
          >
            <Text style={styles.btnTextDark}>Save to My Journey</Text>
          </Pressable>

          <Pressable
            onPress={onShare}
            style={[styles.btn, styles.btnHalf, styles.btnTertiary]}
            accessibilityRole="button"
            accessibilityLabel="Share verse or chapter"
          >
            <Text style={styles.btnTextLight}>Share</Text>
          </Pressable>
        </View>

        {!data ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#0EA5E9" />
          </View>
        ) : isError ? (
          <Text style={styles.errorText}>
            Failed to load {book} {chapter}. Please try again.
          </Text>
        ) : (
          (data.verses ?? []).map((v) => (
            <Text key={v.verse} style={styles.verse}>
              <Text style={styles.verseNumber}>{v.verse} </Text>
              {String(v.text || "").trim()}
            </Text>
          ))
        )}

        {!isError && (data as ApiResp)?.translation_name ? (
          <Text style={styles.mutedText}>
            {(data as ApiResp).translation_name}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
