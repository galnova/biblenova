import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import styles from './styles';

const Stack = createNativeStackNavigator();

// --- Home Screen ---
function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>BibleNova</Text>
        <Text style={styles.intro}>
          Welcome to BibleNova. Choose a bible verse below.
        </Text>

        <View style={styles.grid}>
          <Pressable style={styles.card} onPress={() => navigation.navigate('OldTestament')}>
            <Text style={styles.cardTitle}>Old Testament</Text>
          </Pressable>

          <Pressable style={styles.card} onPress={() => navigation.navigate('NewTestament')}>
            <Text style={styles.cardTitle}>New Testament</Text>
          </Pressable>

          <Pressable style={styles.card} onPress={() => navigation.navigate('Apocrypha')}>
            <Text style={styles.cardTitle}>Apocrypha</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Sub Screens ---
function OldTestamentScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <View style={styles.page}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.sectionTitle}>Old Testament</Text>
      </View>
    </SafeAreaView>
  );
}

function NewTestamentScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <View style={styles.page}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.sectionTitle}>New Testament</Text>
      </View>
    </SafeAreaView>
  );
}

function ApocryphaScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <View style={styles.page}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.sectionTitle}>Apocrypha</Text>
      </View>
    </SafeAreaView>
  );
}

// --- Main App ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OldTestament" component={OldTestamentScreen} />
        <Stack.Screen name="NewTestament" component={NewTestamentScreen} />
        <Stack.Screen name="Apocrypha" component={ApocryphaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
