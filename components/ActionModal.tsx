import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useSettingsStore } from "@/store/settingsStore";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string | React.ReactNode;
  ctaText: string;
  onCtaPress: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaPress?: () => void;
}

export function ActionModal({
  visible,
  onClose,
  title,
  body,
  ctaText,
  onCtaPress,
  secondaryCtaText = "Later",
  onSecondaryCtaPress,
}: ActionModalProps) {
  const { isDarkMode } = useSettingsStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const handleSecondaryPress = onSecondaryCtaPress || onClose;

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {title}
          </Text>

          <ScrollView style={styles.bodyScrollView}>
            {typeof body === "string" ? (
              <Text style={[styles.modalText, { color: theme.secondary }]}>
                {body}
              </Text>
            ) : (
              body
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onCtaPress}
          >
            <Text style={styles.textStyle}>{ctaText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.card }]}
            onPress={handleSecondaryPress}
          >
            <Text style={[styles.textStyle, { color: theme.secondary }]}>
              {secondaryCtaText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
    width: "90%",
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: typography.sizes.lg,
    fontWeight: "bold",
  },
  bodyScrollView: {
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.5,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
