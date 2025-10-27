// src/components/TopBar.tsx
import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  Alert,
  Animated,
  Dimensions,
  Platform,
  BackHandler,
  Easing,
  StatusBar,
} from "react-native";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import styles from "../../styles";
import { bibleBooks } from "../data/books";

type Props = {
  navigation: any;
  route: { name: string };
};

type Book = { name: string; chapters: number };

// ---- helpers ----
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const findBook = (raw: string): Book | null => {
  const key = norm(raw);
  // direct match
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

  // Drawer animation (0 = closed, 1 = open)
  const progress = useRef(new Animated.Value(0)).current;
  const drawerWidth = Math.min(360, Math.round(Dimensions.get("window").width * 0.85));

  const openMenu = useCallback(() => {
    setMenuVisible(true);
    requestAnimationFrame(() => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, [progress]);

  const closeMenu = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  }, [progress]);

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
    const m = raw.match(/^\s*([1-3]?\s*[A-Za-z][A-Za-z\s']+?)\s+(\d+)(?::(\d+))?\s*$/i);
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
        Alert.alert("Invalid chapter", `${book.name} has ${book.chapters} chapters.`);
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
        Alert.alert("Invalid chapter", `${book.name} has ${book.chapters} chapters.`);
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

  const canGoBack = route.name !== "VerseOfDay" && navigation?.canGoBack?.();

  // Drawer derived styles
  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });
  const drawerTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [drawerWidth, 0],
  });

  // Drawer actions
  const navOrSoon = (screen: string, params?: any) => {
    const names = navigation?.getState?.()?.routeNames || [];
    if (names.includes(screen)) {
      navigation.navigate(screen as never, params as never);
    } else {
      Alert.alert("Coming soon", `${screen} isn’t available yet.`);
    }
    closeMenu();
  };

  const closeApp = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      Alert.alert(
        "Close App",
        "On iOS, apps can’t close themselves. Use the Home gesture or App Switcher."
      );
    }
    closeMenu();
  };

  return (
    <View style={styles.topBar}>
      {canGoBack && (
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
        onPress={openMenu}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        <FA5Icon name="bars" solid size={24} color="#fff" />
      </Pressable>

      {/* Right slide-out drawer */}
      <Modal visible={menuVisible} animationType="none" transparent onRequestClose={closeMenu}>
        {/* Clickable overlay (tap anywhere to close) */}
        <Pressable onPress={closeMenu} style={{ flex: 1, backgroundColor: "transparent" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              opacity: overlayOpacity,
            }}
          />
        </Pressable>

        {/* Drawer panel */}
        <Animated.View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: drawerWidth,
            transform: [{ translateX: drawerTranslateX }],
            backgroundColor: "#1b1b1b",
            borderLeftWidth: 1,
            borderLeftColor: "#2A2A2A",
            paddingTop:
              Platform.OS === "android" ? 12 + (StatusBar.currentHeight || 0) : 12,
            paddingHorizontal: 16,
          }}
        >
          {/* Header row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Menu</Text>
            <Pressable onPress={closeMenu} accessibilityLabel="Close menu">
              <FA5Icon name="times" solid size={20} color="#fff" />
            </Pressable>
          </View>

          {/* Items */}
          <Pressable
            onPress={() => navOrSoon("MyJourney")}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14 }}
          >
            <FA5Icon name="bookmark" solid size={18} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 12, fontSize: 16 }}>My Journey</Text>
          </Pressable>

          <Pressable
            onPress={() => navOrSoon("Books")}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14 }}
          >
            <FA5Icon name="book" solid size={18} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 12, fontSize: 16 }}>Full Bible</Text>
          </Pressable>

          <Pressable
            onPress={() => navOrSoon("Settings")}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14 }}
          >
            <FA5Icon name="cog" solid size={18} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 12, fontSize: 16 }}>Settings</Text>
          </Pressable>

          <View style={{ height: 8 }} />

          <Pressable
            onPress={closeApp}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14 }}
          >
            <FA5Icon name="power-off" solid size={18} color="#F87171" />
            <Text style={{ color: "#F87171", marginLeft: 12, fontSize: 16 }}>Close App</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  );
}
