import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import styles from "../../styles";
import TopBar from "../components/TopBar";
import { bibleBooks } from "../data/books";

type Verse = { verse: number; text: string };
type ChapterResponse = { verses?: Verse[] };

type MergedVerse = {
  chapter: number;
  verse: number;
  text: string;
};

type RouteParams = {
  book?: string;      // e.g. "John"
  bookName?: string;  // alternative param name, also "John"
};

export default function SortScreen({ navigation, route }: any) {
  // Accept book or bookName; default to "John"
  const paramBook =
    ((route?.params as RouteParams)?.book ||
      (route?.params as RouteParams)?.bookName ||
      "John").trim();

  // bible-api naming difference
  const apiBookName = paramBook === "Song of Solomon" ? "Song of Songs" : paramBook;

  // metadata about the book (chapters count, etc.)
  const bookMeta = useMemo(
    () => bibleBooks.find((b) => b.name.toLowerCase() === paramBook.toLowerCase()),
    [paramBook]
  );

  const [loading, setLoading] = useState(false);
  const [progressChapter, setProgressChapter] = useState(0);
  const [verses, setVerses] = useState<MergedVerse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // cancellation handling
  const cancelledRef = useRef(false);
  const controllersRef = useRef<AbortController[]>([]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current = [];
    };
  }, []);

  // If the incoming book changes, reset state
  useEffect(() => {
    setVerses([]);
    setError(null);
    setProgressChapter(0);
    cancelledRef.current = false;
    controllersRef.current.forEach((c) => c.abort());
    controllersRef.current = [];
  }, [paramBook]);

  const loadWholeBook = useCallback(async () => {
    if (!bookMeta) {
      setError(`Unknown book: ${paramBook}`);
      return;
    }

    setLoading(true);
    setError(null);
    setVerses([]);
    setProgressChapter(0);
    cancelledRef.current = false;

    try {
      for (let c = 1; c <= bookMeta.chapters; c++) {
        if (cancelledRef.current) break;

        const controller = new AbortController();
        controllersRef.current.push(controller);

        const q = encodeURIComponent(`${apiBookName} ${c}`);
        const res = await fetch(`https://bible-api.com/${q}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} on ${paramBook} ${c}`);

        const json: ChapterResponse = await res.json();
        const chunk: MergedVerse[] = (json.verses ?? []).map((v) => ({
          chapter: c,
          verse: v.verse,
          text: String(v.text || "").trim(),
        }));

        // append verses as they arrive (keeps UI responsive)
        setVerses((prev) => prev.concat(chunk));
        setProgressChapter(c);

        // remove used controller
        controllersRef.current = controllersRef.current.filter((x) => x !== controller);
      }
    } catch (e: any) {
      if (!cancelledRef.current) {
        setError(e?.message || "Failed to load book.");
      }
    } finally {
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current = [];
      if (!cancelledRef.current) setLoading(false);
    }
  }, [bookMeta, apiBookName, paramBook]);

  const cancelLoading = useCallback(() => {
    cancelledRef.current = true;
    controllersRef.current.forEach((c) => c.abort());
    controllersRef.current = [];
    setLoading(false);
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<MergedVerse>) => (
    <Text style={styles.verse}>
      <Text style={styles.verseNumber}>
        {item.chapter}:{item.verse}{" "}
      </Text>
      {item.text}
    </Text>
  );

  const keyExtractor = (item: MergedVerse, idx: number) =>
    `${paramBook}-${item.chapter}-${item.verse}-${idx}`;

  return (
    <SafeAreaView style={styles.page}>
      <TopBar navigation={navigation} route={{ name: "Sort" }} />

      {/* Body area with pinned footer (no inline styles) */}
      <View style={styles.pageBodyRelative}>
        {/* Header + actions */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>📚 Read All of {paramBook}</Text>

          {!bookMeta ? (
            <Text style={styles.errorText}>
              Unknown book. Use the Books page to pick a valid one.
            </Text>
          ) : (
            <>
              {!loading ? (
                <View style={styles.buttonRow}>
                  <Pressable
                    onPress={loadWholeBook}
                    style={[styles.btn, styles.btnPrimary, styles.btnResponsive]}
                    accessibilityRole="button"
                    accessibilityLabel={`Read whole ${paramBook}`}
                  >
                    <Text style={styles.btnTextDark}>
                      Read Whole {paramBook} ({bookMeta.chapters} chapters)
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => navigation.navigate("Chapters", { book: bookMeta })}
                    style={[styles.btn, styles.btnSecondary, styles.btnResponsive]}
                    accessibilityRole="button"
                    accessibilityLabel={`Open chapters of ${paramBook}`}
                  >
                    <Text style={styles.btnTextDark}>Open Chapter List</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.buttonRow}>
                  <Pressable
                    onPress={cancelLoading}
                    style={[styles.btn, styles.btnSecondary, styles.btnResponsive]}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel loading"
                  >
                    <Text style={styles.btnTextDark}>Cancel Loading</Text>
                  </Pressable>
                </View>
              )}

              {loading && (
                <Text style={styles.progressText}>
                  Loading chapter {progressChapter} / {bookMeta.chapters}…
                </Text>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
        </View>

        {/* Content list */}
        {loading && verses.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#0EA5E9" />
          </View>
        ) : verses.length > 0 ? (
          <FlatList
            data={verses}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          !loading &&
          !error && (
            <View style={styles.emptyWrap}>
              <Text style={styles.mutedText}>
                Tap <Text style={styles.strong}>“Read Whole {paramBook}”</Text> to load every
                chapter into one view, or open the chapter list to jump to a
                specific chapter.
              </Text>
            </View>
          )
        )}

        {/* Spacer so content doesn't get hidden behind absolute footer */}
        <View style={styles.footerSpacer} />

        {/* Footer pinned to bottom */}
        <View style={styles.footerAbsolute}>
          <View style={styles.buttonRowUnder}>
            <Pressable
              onPress={() => navigation.navigate("Books")}
              style={[styles.btn, styles.btnHalf, styles.btnSecondary]}
              accessibilityRole="button"
              accessibilityLabel="Skip to Books"
            >
              <Text style={styles.btnTextDark}>Skip to Books</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("MyJourney")}
              style={[styles.btn, styles.btnHalf, styles.btnSuccess]}
              accessibilityRole="button"
              accessibilityLabel="Open My Journey"
            >
              <Text style={styles.btnTextDark}>My Journey</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
