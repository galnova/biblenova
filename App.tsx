import React, { useState, useEffect, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import FA5Icon from "react-native-vector-icons/FontAwesome5"; // 👈 FontAwesome5
import styles from "./styles";

/* ----------------------------- Data ----------------------------- */
const bibleBooks = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 },
  { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 },
  { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 },
  { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 },
  { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 },
  { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 },
  { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 },
  { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 },
  { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 },
  { name: "2 Corinthians", chapters: 13 },
  { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 },
  { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 },
  { name: "2 Thessalonians", chapters: 3 },
  { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 },
  { name: "Titus", chapters: 3 },
  { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 },
  { name: "James", chapters: 5 },
  { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 },
  { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 },
  { name: "Jude", chapters: 1 },
  { name: "Revelation", chapters: 22 },
];

/* ------------------------ Verse of the Day ----------------------- */
const VOD_REFERENCES = [
  "John 3:16",
  "Psalm 23:1",
  "Jeremiah 29:11",
  "Philippians 4:6-7",
  "Romans 8:28",
  "Proverbs 3:5-6",
  "Isaiah 41:10",
  "Matthew 11:28-30",
  "Psalm 119:105",
  "1 Corinthians 13:4-7",
  "Romans 12:2",
  "Ephesians 2:8-9",
  "Joshua 1:9",
  "Hebrews 11:1",
  "James 1:5",
  "1 Peter 5:7",
  "2 Timothy 1:7",
  "Galatians 5:22-23",
  "Romans 5:8",
  "Psalm 27:1",
  "Proverbs 18:10",
  "Psalm 46:1",
  "1 John 1:9",
  "Psalm 34:8",
  "Romans 10:9",
  "Matthew 6:33",
  "Colossians 3:23-24",
  "Psalm 121:1-2",
  "Isaiah 40:31",
  "Song of Solomon 2:1",
  "Micah 6:8",
];

function pickVOD(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((+date - +start) / 86400000);
  return VOD_REFERENCES[day % VOD_REFERENCES.length];
}

/* --------------------------- Navigation -------------------------- */
const Stack = createNativeStackNavigator();

/* ------------------------ Shared Top Bar ------------------------- */
function TopBar({ navigation, route }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [input, setInput] = useState("");

  // Accepts "John 3" or "1 John 4" etc.
  const handleGoTo = () => {
    if (!input) return;
    const parts = input.trim().split(/\s+/);
    if (parts.length < 2) {
      alert('Invalid format. Try “John 3” or “1 John 4”.');
      return;
    }
    const chapStr = parts.pop();
    const chap = parseInt(String(chapStr || ""), 10);
    const bookName = parts.join(" ");
    const book = bibleBooks.find(
      (b) => b.name.toLowerCase() === bookName.toLowerCase()
    );
    if (book && chap && chap >= 1 && chap <= book.chapters) {
      navigation.navigate("Verses", { book: book.name, chapter: chap });
      setInput("");
    } else {
      alert("Invalid book or chapter.");
    }
  };

  return (
    <View style={styles.topBar}>
      {/* Only show back if not on the initial screen */}
      {route.name !== "Landing" && navigation?.canGoBack?.() && (
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FA5Icon name="arrow-left" solid size={16} color="#111" />
            <Text style={[styles.backBtnText, { marginLeft: 6 }]}>Back</Text>
          </View>
        </Pressable>
      )}

      <TextInput
        style={styles.topBarInput}
        placeholder="Go To (e.g. John 3)"
        placeholderTextColor="#aaa"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleGoTo}
      />

      <Pressable
        style={styles.topBarHamburger}
        onPress={() => setMenuVisible(true)}
      >
        <FA5Icon name="bars" solid size={24} color="#fff" />
      </Pressable>

      {/* Modal Menu */}
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

/* -------------------- Verse of the Day (Splash) ------------------- */
function VerseOfDayScreen({ navigation, route }) {
  const reference = useMemo(() => pickVOD(new Date()), []);
  const [data, setData] = useState(null);

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

  const normalizedBook = (apiName) =>
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
      <TopBar navigation={navigation} route={route} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Text style={[styles.h1, { marginTop: 16 }]}>✨ Verse of the Day</Text>
        <Text style={{ color: "#e5e5e5", marginBottom: 8 }}>{reference}</Text>

        {!data ? (
          <ActivityIndicator size="large" color="#00f2ea" />
        ) : data.error ? (
          <Text style={{ color: "#f88", marginTop: 12 }}>
            Couldn’t load {reference}. You can continue to Books.
          </Text>
        ) : (
          <>
            <Text style={{ color: "#fff", lineHeight: 24 }}>
              {(data.verses || [])
                .map((v) => String(v.text || "").trim())
                .join(" ")
                .trim()}
            </Text>
            <Text style={{ color: "#aaa", marginTop: 8 }}>
              — {data.reference || reference} ({data.translation_name || "KJV"})
            </Text>
          </>
        )}

        <View style={{ height: 20 }} />
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={openChapter}
            style={{
              backgroundColor: "#00f2ea",
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
              marginRight: 10,
            }}
          >
            <Text style={{ color: "#111", fontWeight: "bold" }}>Open Full Chapter</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Books")}
            style={{
              backgroundColor: "#facc15",
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#111", fontWeight: "bold" }}>Skip to Books</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --------------------------- Landing page ------------------------ */
function LandingScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar navigation={navigation} route={route} />
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 48 }]}>
        <Text style={styles.h1}>👋 Welcome to BibleNova</Text>
        <Text style={styles.intro}>
          Choose where to begin.
        </Text>

        <View style={{ width: "100%", gap: 12, marginTop: 8 }}>
          <Pressable
            onPress={() => navigation.navigate("Books")}
            style={{
              backgroundColor: "#00f2ea",
              paddingVertical: 16,
              paddingHorizontal: 18,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "bold", fontSize: 16 }}>
              📖 Read the Bible
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("MyJourney")}
            style={{
              backgroundColor: "#facc15",
              paddingVertical: 16,
              paddingHorizontal: 18,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "bold", fontSize: 16 }}>
              🧭 My Journey
            </Text>
          </Pressable>

          {/* Optional quick link to Verse of the Day */}
          <Pressable
            onPress={() => navigation.navigate("Splash")}
            style={{
              backgroundColor: "#171717",
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333",
              marginTop: 6,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              ✨ Verse of the Day
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------- My Journey page ---------------------- */
function MyJourneyScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.page}>
      <TopBar navigation={navigation} route={route} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>🧭 My Journey</Text>
        <Text style={{ color: "#e5e5e5", marginTop: 8 }}>
          This is your space. In a future update, we can add journaling, bookmarks,
          highlights, and reading progress here.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------- Book list screen ---------------------- */
function BookScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar navigation={navigation} route={route} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>📖 BibleNova</Text>
        <Text style={styles.intro}>Choose a book to begin reading</Text>
        <View style={styles.grid}>
          {bibleBooks.map((book) => (
            <Pressable
              key={book.name}
              style={styles.card}
              onPress={() => navigation.navigate("Chapters", { book })}
            >
              <Text style={styles.cardTitle}>{book.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------ Chapter list screen -------------------- */
function ChapterScreen({ route, navigation }) {
  const { book } = route.params;
  return (
    <SafeAreaView style={styles.page}>
      <TopBar navigation={navigation} route={route} />
      <ScrollView>
        <Text style={styles.sectionTitle}>{book.name}</Text>
        <View style={styles.grid}>
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
            <Pressable
              key={ch}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Verses", { book: book.name, chapter: ch })
              }
            >
              <Text style={styles.cardTitle}>{ch}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------------- Verses screen ---------------------- */
function VerseScreen({ route, navigation }) {
  const { book, chapter } = route.params;
  const [data, setData] = useState(null);

  useEffect(() => {
    const q = encodeURIComponent(`${book} ${chapter}`);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 12000);

    fetch(`https://bible-api.com/${q}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error("Error fetching verse:", err);
        setData({ verses: [], error: String(err) });
      })
      .finally(() => clearTimeout(id));

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [book, chapter]);

  return (
    <SafeAreaView style={styles.page}>
      <TopBar navigation={navigation} route={route} />
      <ScrollView>
        <Text style={styles.sectionTitle}>
          {book} {chapter}
        </Text>
        {!data ? (
          <ActivityIndicator size="large" color="#00f2ea" />
        ) : data.error ? (
          <Text style={{ color: "#f88", marginTop: 12 }}>
            Failed to load {book} {chapter}. Please try again.
          </Text>
        ) : (
          (data.verses || []).map((v) => (
            <Text key={v.verse} style={styles.verse}>
              <Text style={styles.verseNumber}>{v.verse} </Text>
              {String(v.text || "").trim()}
            </Text>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------ App ----------------------------- */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Splash" component={VerseOfDayScreen} />
        <Stack.Screen name="Books" component={BookScreen} />
        <Stack.Screen name="Chapters" component={ChapterScreen} />
        <Stack.Screen name="Verses" component={VerseScreen} />
        <Stack.Screen name="MyJourney" component={MyJourneyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
