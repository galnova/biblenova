// src/components/RightDrawer.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  SafeAreaView,
  Text,
  View,
  BackHandler,
  Platform,
  Alert,
} from "react-native";
import styles from "../../styles";

type RightDrawerProps = {
  visible: boolean;
  onClose: () => void;
  navigation: any;
};

export default function RightDrawer({ visible, onClose, navigation }: RightDrawerProps) {
  const { width } = Dimensions.get("window");
  const translate = useRef(new Animated.Value(width)).current;

  // Slide in/out when `visible` changes
  useEffect(() => {
    Animated.timing(translate, {
      toValue: visible ? 0 : width,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, translate, width]);

  // If user taps overlay, close
  const close = () => {
    onClose?.();
  };

  // Navigation items
  const goMyJourney = () => {
    onClose?.();
    navigation.navigate("MyJourney");
  };

  const goFullBible = () => {
    onClose?.();
    navigation.navigate("Books");
  };

  const goSettings = () => {
    onClose?.();
    // Navigate if you have a "Settings" screen, otherwise show a friendly note.
    if (navigation.getState?.()?.routeNames?.includes("Settings")) {
      navigation.navigate("Settings");
    } else {
      Alert.alert("Coming soon", "Settings screen isn’t wired up yet.");
    }
  };

  const closeApp = () => {
    onClose?.();
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      Alert.alert("Not supported", "iOS apps can’t be programmatically closed.");
    }
  };

  // Don’t render overlay/touch targets when hidden
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.drawerContainer} pointerEvents="box-none">
      {/* Dimmed backdrop */}
      <Pressable style={styles.drawerOverlay} onPress={close} />

      {/* Right panel */}
      <Animated.View
        style={[
          styles.drawerPanel,
          { transform: [{ translateX: translate }] },
        ]}
      >
        <SafeAreaView style={styles.drawerSafe}>
          <Text style={styles.drawerTitle}>Menu</Text>

          <Pressable style={styles.drawerItem} onPress={goMyJourney} accessibilityRole="button">
            <Text style={styles.drawerItemText}>My Journey</Text>
          </Pressable>

          <Pressable style={styles.drawerItem} onPress={goFullBible} accessibilityRole="button">
            <Text style={styles.drawerItemText}>Full Bible</Text>
          </Pressable>

          <Pressable style={styles.drawerItem} onPress={goSettings} accessibilityRole="button">
            <Text style={styles.drawerItemText}>Settings</Text>
          </Pressable>

          <View style={styles.drawerDivider} />

          <Pressable style={[styles.drawerItem, styles.drawerDanger]} onPress={closeApp} accessibilityRole="button">
            <Text style={styles.drawerDangerText}>Close App</Text>
          </Pressable>

          <View style={styles.drawerFooterSpace} />
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
