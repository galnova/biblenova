// src/components/TopBar.tsx
import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Modal, Alert } from "react-native";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import styles from "../../styles";
import { bibleBooks } from "../data/books";

type Props = {
  navigation: any;
  route: { name: string };
};

type Book = { name: string; chapters: number };

// --- helpers ---
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const findBook = (raw: string): Book | null => {
  const key = norm(raw);
  // direct matches
  let hit = bibleBooks.find((b) => norm(b.name) === key);
  if (hit) return hit;

  // simple synonyms
  const synonyms: Record<string, string> = {
    songofsongs: "songofsolomon",
    canticles: "songofsolomon",
  };
  const mapped = synonyms[key];
  if (mapped) {
    hit = bibleBooks.find((b) => norm(b.name) === mapped);
    if (hit) return hit;
  }
  return null;
};

export default function TopBar({ navigation, route }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [input, setInput] = useState("");

  const goTo = () => {
    const raw = input.trim();
    if (!raw) return;

    // 1) Book only (e.g. "John")
    const bookOnly = findBook(raw);
    if (bookOnly) {
      navigation.navigate("Sort", { bookName: bookOnly.name });
      setInput("");
      return;
    }

    // 2) Book + chapter[:verse]  (e.g. "John 3", "1 John 4:7")
    const m = raw.match(
      /^\s*([1-3]?\s*[A-Za-z][A-Za-z\s']+?)\s+(\d+)(?::(\d+))?\s*$/i
    );
    if (m) {
      const [, bookStr, chapStr, verseStr] = m;
      const book = findBook(bookStr);
      const chapter = parseInt(chapStr, 10);
      const verse = verseStr ? parseInt(verseStr, 10) : undefined;

      if (!book) {
        Alert.alert("Not found", `I couldn't find the book “${bookStr}”.`);
        return;
      }
      if (!(chapter >= 1 && chapter <= book.chapters)) {
        Alert.alert(
          "Invalid chapter",
          `${book.name} has ${book.chapters} chapters.`
        );
        return;
      }

      navigation.navigate("Verses", {
        book: book.name,
        chapter,
        ...(verse ? { targetVerse: verse } : {}),
      });
      setInput("");
      return;
    }

    // 3) Book + 3 digits (e.g. "John 316" => John 3:16)
    const mPacked = raw.match(/^\s*([1-3]?\s*[A-Za-z][A-Za-z\s']+?)\s+(\d{3,})\s*$/i);
    if (mPacked) {
      const [, bookStr, numStr] = mPacked;
      const book = findBook(bookStr);
      if (!book) {
        Alert.alert("Not found", `I couldn't find the book “${bookStr}”.`);
        return;
      }
      // Split last two digits as verse; rest is chapter
      const verse = parseInt(numStr.slice(-2), 10);
      const chapter = parseInt(numStr.slice(0, -2), 10);

      if (!(chapter >= 1 && chapter <= book.chapters)) {
        Alert.alert(
          "Invalid chapter",
          `${book.name} has ${book.chapters} chapters.`
        );
        return;
      }
      navigation.navigate("Verses", { book: book.name, chapter, targetVerse: verse });
      setInput("");
      return;
    }

    // If nothing matched:
    Alert.alert(
      "Invalid format",
      'Try one of:\n• "John"\n• "John 3"\n• "John 3:16"\n• "John 316"'
    );
  };

  return (
    <View style={styles.topBar}>
      {route.name !== "VerseOfDay" && navigation?.canGoBack?.() && (
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FA5Icon name="arrow-left" solid size={16} color="#111" />
            <Text style={[styles.backBtnText, { marginLeft: 6 }]}>Back</Text>
          </View>
        </Pressable>
      )}

      <TextInput
        style={styles.topBarInput}
        placeholder='Go To (e.g. "John 3:16")'
        placeholderTextColor="#aaa"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={goTo}
        returnKeyType="go"
      />

      <Pressable
        style={styles.topBarHamburger}
        onPress={() => setMenuVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
      >
        <FA5Icon name="bars" solid size={24} color="#fff" />
      </Pressable>

      <Modal visible={menuVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#222",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text style={{ fontSize: 18, color: "#fff", marginBottom: 20 }}>
              ⚙️ Settings Menu
            </Text>
            <Pressable
              onPress={() => setMenuVisible(false)}
              style={{
                padding: 12,
                backgroundColor: "#444",
                borderRadius: 6,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
