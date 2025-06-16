import RescueMode from "@/components/RescueMode";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import { Tabs } from "expo-router";
import { Grid3X3, Heart, Home, Settings } from "lucide-react-native";
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
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            tabBarIcon: ({ color, size }) => (
              <Grid3X3 size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ color, size }) => (
              <Heart size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
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
