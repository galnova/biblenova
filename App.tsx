// app.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import VerseOfDay from "./src/screens/VerseOfDay";
import Books from "./src/screens/Books";
import Chapters from "./src/screens/Chapters";
import Verses from "./src/screens/Verses";
import MyJourney from "./src/screens/MyJourney";
import Sort from "./src/screens/Sort";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="VerseOfDay"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="VerseOfDay" component={VerseOfDay} />
        <Stack.Screen name="Books" component={Books} />
        <Stack.Screen name="Chapters" component={Chapters} />
        <Stack.Screen name="Verses" component={Verses} />
        <Stack.Screen name="MyJourney" component={MyJourney} />
        <Stack.Screen name="Sort" component={Sort} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
