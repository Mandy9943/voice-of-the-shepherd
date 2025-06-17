import { AudioProvider } from "@/components/AudioProvider";
import { colors } from "@/constants/colors";
import { usePlayerStore } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <AudioProvider>
      <RootLayoutNav />
    </AudioProvider>
  );
}

function RootLayoutNav() {
  const { isDarkMode, hasCompletedOnboarding } = useSettingsStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const { resetDailyProgressIfNeeded } = usePlayerStore();
  const router = useRouter();
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setIsStoreReady(true);
    });

    if (useSettingsStore.persist.hasHydrated()) {
      setIsStoreReady(true);
    }

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!isStoreReady) {
      return;
    }
    if (!hasCompletedOnboarding) {
      router.replace("/onboarding/welcome");
    }
  }, [isStoreReady, hasCompletedOnboarding, router]);

  useEffect(() => {
    resetDailyProgressIfNeeded();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        resetDailyProgressIfNeeded();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [resetDailyProgressIfNeeded]);

  if (!isStoreReady) {
    return null;
  }

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
          headerShown: false,
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
