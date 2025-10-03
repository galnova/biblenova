import React, { useState, useEffect } from "react";
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
import FA5Icon from "react-native-vector-icons/FontAwesome5"; // 👈 Use FontAwesome5
import styles from "./styles";

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

const Stack = createNativeStackNavigator();

// --- Shared Top Bar (Back + Input + Hamburger)
function TopBar({ navigation, route }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [input, setInput] = useState("");

  const handleGoTo = () => {
    if (!input) return;
    const [bookName, chapStr] = input.split(" ");
    const book = bibleBooks.find(
      (b) => b.name.toLowerCase() === bookName.toLowerCase()
    );
    const chap = parseInt(chapStr, 10);
    if (book && chap && chap <= book.chapters) {
      navigation.navigate("Verses", { book: book.name, chapter: chap });
      setInput("");
    } else {
      alert("Invalid book or chapter");
    }
  };

  return (
    <View style={styles.topBar}>
      {/* Only show back if not on Books (landing) */}
{route.name !== "Books" && navigation.canGoBack() && (
  <Pressable
    style={styles.backBtn}
    onPress={() => navigation.goBack()}
  >
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

// Book list screen
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

// Chapter list screen
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

// Verses screen
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Books" component={BookScreen} />
        <Stack.Screen name="Chapters" component={ChapterScreen} />
        <Stack.Screen name="Verses" component={VerseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
