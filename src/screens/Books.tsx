// src/screens/Books.tsx
import React from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";
import styles from "../../styles";
import TopBar from "../components/TopBar";
import { bibleBooks } from "../data/books";

export default function BookScreen({ navigation, route }: any) {
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
