// src/screens/MyJourney.tsx
import React from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import styles from "../../styles";
import TopBar from "../components/TopBar";

export default function MyJourneyScreen({ navigation, route }: any) {
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
