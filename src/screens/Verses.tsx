// src/screens/Verses.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import styles from "../../styles";
import TopBar from "../components/TopBar";

type Verse = { verse: number; text: string; chapter?: number; book_name?: string };
type ApiResp = {
  verses?: Verse[];
  reference?: string;
  translation_name?: string;
};

export default function VerseScreen({ route, navigation }: any) {
const { book, chapter, targetVerse } = route.params as {
  book: string;
  chapter: number;
  targetVerse?: number;
};
  const [data, setData] = useState<ApiResp | { error: string } | null>(null);

  useEffect(() => {
    // bible-api uses "Song of Songs" rather than "Song of Solomon"
    const apiBook = book === "Song of Solomon" ? "Song of Songs" : book;
    const q = encodeURIComponent(`${apiBook} ${chapter}`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

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

  const isError = data && "error" in data;

  return (
    <SafeAreaView style={styles.page}>
      <TopBar navigation={navigation} route={route} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.sectionTitle}>
          {book} {chapter}
        </Text>

        {!data ? (
          <ActivityIndicator size="large" color="#00f2ea" />
        ) : isError ? (
          <Text style={{ color: "#f88", marginTop: 12 }}>
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

        {data && !isError && (data as ApiResp).translation_name ? (
          <Text style={{ color: "#aaa", marginTop: 8 }}>
            {(data as ApiResp).translation_name}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
