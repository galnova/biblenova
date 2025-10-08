// src/screens/MyJourney.tsx
import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Share,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import styles from "../../styles";
import TopBar from "../components/TopBar";
import {
  loadJournal,
  removeJournalEntry,
  JournalEntry,
} from "../utils/journal";

export default function MyJourneyScreen({ navigation, route }: any) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // track which entries are expanded (full text)
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Reload entries each time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        const list = await loadJournal();
        if (mounted) {
          setEntries(list);
          setLoading(false);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const onShare = useCallback((entry: JournalEntry) => {
    Share.share({
      message: `${entry.ref}\n\n${entry.text}`,
      title: entry.ref,
    }).catch(() => {});
  }, []);

  const onRemove = useCallback((entry: JournalEntry) => {
    Alert.alert(
      "Remove entry",
      `Delete “${entry.ref}” from My Journey?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await removeJournalEntry(entry.id);
            const list = await loadJournal();
            setEntries(list);
            // also collapse if it was expanded
            setExpanded((prev) => {
              const next = new Set(prev);
              next.delete(entry.id);
              return next;
            });
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  const renderItem = ({ item }: { item: JournalEntry }) => {
    const isExpanded = expanded.has(item.id);
    return (
      <View style={styles.journeyItem}>
        <View style={styles.journeyHeaderRow}>
          <Text style={styles.journeyRef}>{item.ref}</Text>

          {/* Upper-right icons (Share + Trash) */}
          <View style={styles.journeyHeaderIcons}>
            <Pressable
              onPress={() => onShare(item)}
              accessibilityRole="button"
              accessibilityLabel={`Share ${item.ref}`}
              style={styles.journeyIconBtn}
            >
              <FA5Icon name="share-alt" size={18} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => onRemove(item)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.ref}`}
              style={styles.journeyIconBtn}
            >
              <FA5Icon name="trash" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Truncated to 5 lines with ellipsis when not expanded */}
        <Text
          style={styles.journeyText}
          numberOfLines={isExpanded ? undefined : 5}
          ellipsizeMode="tail"
        >
          {item.text}
        </Text>

        {/* Show more / Show less CTA (small, left-aligned) */}
        <Pressable
          onPress={() => toggleExpanded(item.id)}
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? `Show less for ${item.ref}` : `Show more for ${item.ref}`}
          style={styles.journeyIconBtn}
        >
          <Text style={styles.mutedText}>
            {isExpanded ? "Show less" : "Show more"}
          </Text>
        </Pressable>

        <Text style={styles.journeyMeta}>
          Saved {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <TopBar navigation={navigation} route={route} />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.mutedText}>
            Nothing here yet. From any chapter, tap{" "}
            <Text style={styles.strong}>“Save to My Journey”</Text> to add a verse or full chapter.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}
