import RescueMode from "@/components/RescueMode";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import { Tabs } from "expo-router";
import { BookmarkIcon, Home, Search, Settings } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  const { isDarkMode, rescueModeSettings } = useSettingsStore();
  const [showRescueMode, setShowRescueMode] = useState(false);
  const theme = isDarkMode ? colors.dark : colors.light;

  const handleSOSPress = () => {
    if (rescueModeSettings.enabled) {
      setShowRescueMode(true);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.secondary,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Home
                size={focused ? 20 : 18}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Search
                size={focused ? 20 : 18}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <BookmarkIcon
                size={focused ? 20 : 18}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Settings
                size={focused ? 20 : 18}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
      </Tabs>

      {/* SOS Button */}
      {/* {rescueModeSettings.enabled && (
        <TouchableOpacity
          style={[
            styles.sosButton,
            { backgroundColor: theme.rescue?.danger || "#DC2626" },
          ]}
          onPress={handleSOSPress}
          activeOpacity={0.8}
        >
          <Shield size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )} */}

      {/* Mini Player */}
      {/* <MiniPlayer /> */}

      {/* Rescue Mode Modal */}
      <RescueMode
        visible={showRescueMode}
        onClose={() => setShowRescueMode(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sosButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});
