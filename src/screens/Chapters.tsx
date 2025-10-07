// src/screens/Chapters.tsx
import React from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";
import styles from "../../styles";
import TopBar from "../components/TopBar";

export default function ChapterScreen({ route, navigation }: any) {
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
