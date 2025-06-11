import { AudioProvider } from "@/components/AudioProvider";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <AudioProvider>
      <RootLayoutNav />
    </AudioProvider>
  );
}

function RootLayoutNav() {
  const { isDarkMode } = useSettingsStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerBackTitle: "Back",
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="quote/[id]"
          options={{
            title: "Quote",
            headerTransparent: true,
            headerTintColor: "#FFFFFF",
            headerBackTitle: "Back",
          }}
        />
        {/* <Stack.Screen
          name="category/[id]"
          options={{
            title: "Category",
            headerBackTitle: "Categories",
          }}
        /> */}
      </Stack>
    </>
  );
}
