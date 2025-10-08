// src/screens/VerseOfDay.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  View,
} from "react-native";
import styles from "../../styles";
import TopBar from "../components/TopBar";
import RightDrawer from "../components/RightDrawer";
import { pickVOD } from "../utils/pickVOD";

export default function VerseOfDayScreen({ navigation, route }: any) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const reference = useMemo(() => pickVOD(new Date()), []);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const q = encodeURIComponent(reference);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 12000);

    fetch(`https://bible-api.com/${q}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error("VOD fetch error:", err);
        setData({ verses: [], error: String(err), reference });
      })
      .finally(() => clearTimeout(id));

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [reference]);

  const normalizedBook = (apiName: string) =>
    apiName === "Song of Songs" ? "Song of Solomon" : apiName;

  const openChapter = () => {
    if (!data?.verses?.length) {
      navigation.navigate("Books");
      return;
    }
    const v0 = data.verses[0];
    const bookName = normalizedBook(v0.book_name);
    const chapter = v0.chapter || 1;
    navigation.navigate("Verses", { book: bookName, chapter });
  };

  return (
    <SafeAreaView style={styles.page}>
      {/* Top bar stays fixed; hamburger opens the slide-out */}
      <TopBar
        navigation={navigation}
        route={route}
        onHamburgerPress={() => setDrawerOpen(true)}
      />

      {/* Body: scrollable center + fixed footer */}
      <View style={styles.pageBody}>
        <ScrollView contentContainerStyle={[styles.vodScrollContent, styles.centerArea]}>
          <Text style={[styles.h1, styles.vodTitle]}>✨ Verse of the Day</Text>
          <Text style={styles.vodReference}>{reference}</Text>

          {!data ? (
            <ActivityIndicator size="large" color="#00f2ea" />
          ) : (data as any).error ? (
            <Text style={styles.vodError}>
              Couldn’t load {reference}. You can continue to Books.
            </Text>
          ) : (
            <>
              <Text style={styles.vodBodyText}>
                {(data.verses || [])
                  .map((v: any) => String(v.text || "").trim())
                  .join(" ")
                  .trim()}
              </Text>
              <Text style={styles.vodAttribution}>
                — {data.reference || reference} ({data.translation_name || "KJV"})
              </Text>
            </>
          )}

          <View style={styles.spacer20} />

          {/* Full-width primary CTA */}
          <Pressable
            onPress={openChapter}
            style={[styles.btn, styles.btnFullWidth, styles.btnPrimary]}
          >
            <Text style={styles.btnTextDark}>Open Full Chapter</Text>
          </Pressable>
        </ScrollView>

        {/* Footer CTAs */}
        <View style={styles.footer}>
          <View style={styles.buttonRowUnder}>
            <Pressable
              onPress={() => navigation.navigate("Books")}
              style={[styles.btn, styles.btnHalf, styles.btnSecondary]}
            >
              <Text style={styles.btnTextDark}>Skip to Books</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("MyJourney")}
              style={[styles.btn, styles.btnHalf, styles.btnSuccess]}
            >
              <Text style={styles.btnTextDark}>My Journey</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Slide-out drawer overlay */}
      <RightDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}
