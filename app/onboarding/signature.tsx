import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useSettingsStore } from "@/store/settingsStore";
import { useRouter } from "expo-router";
import { Check, PenTool } from "lucide-react-native";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignatureCanvas, {
  SignatureViewRef,
} from "react-native-signature-canvas";

export default function SignatureScreen() {
  const router = useRouter();
  const { isDarkMode, personalInfo, signContract } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? colors.dark : colors.light;

  const signatureRef = useRef<SignatureViewRef>(null);

  const handleSignature = (signature: string) => {
    signContract(signature);
    router.push("/onboarding/complete");
  };

  const handleEmpty = () => {
    // This can be used to show an alert if the user tries to save an empty signature
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  const webStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      border-radius: 12px;
    }
    .m-signature-pad--body {
      border: none;
      border-radius: 12px;
    }
    .m-signature-pad--footer {
      display: none;
      margin: 0px;
    }
  `;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${theme.primary}15` },
            ]}
          >
            <PenTool size={48} color={theme.primary} />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {personalInfo.name
              ? `${personalInfo.name}, let's make a contract`
              : "Let's make a contract"}
          </Text>
        </View>

        <View style={styles.contractContainer}>
          <Text style={[styles.contractTitle, { color: theme.text }]}>
            From this day, I commit to:
          </Text>

          <View style={styles.commitmentsList}>
            <View style={styles.commitmentItem}>
              <Check size={16} color="#10B981" />
              <Text style={[styles.commitmentText, { color: theme.secondary }]}>
                Growing closer to God daily
              </Text>
            </View>

            <View style={styles.commitmentItem}>
              <Check size={16} color="#10B981" />
              <Text style={[styles.commitmentText, { color: theme.secondary }]}>
                Listening to spiritual teachings
              </Text>
            </View>

            <View style={styles.commitmentItem}>
              <Check size={16} color="#10B981" />
              <Text style={[styles.commitmentText, { color: theme.secondary }]}>
                Building consistent spiritual habits
              </Text>
            </View>

            <View style={styles.commitmentItem}>
              <Check size={16} color="#10B981" />
              <Text style={[styles.commitmentText, { color: theme.secondary }]}>
                Seeking divine guidance and forgiveness
              </Text>
            </View>
          </View>

          <Text style={[styles.trustText, { color: theme.text }]}>
            And I trust Voice of the Shepherd to guide me along the way and help
            me accomplish my spiritual resolutions.
          </Text>
        </View>

        <Text style={[styles.signaturePrompt, { color: theme.text }]}>
          Please sign below to confirm your commitment:
        </Text>

        <View
          style={[
            styles.signatureCanvasContainer,
            { borderColor: theme.border },
          ]}
        >
          <SignatureCanvas
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={handleEmpty}
            onEnd={handleEnd}
            descriptionText=""
            clearText="Clear"
            confirmText="I commit to myself"
            penColor={theme.primary}
            backgroundColor={theme.card}
            webStyle={webStyle}
            minWidth={2}
            maxWidth={4}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.quoteFont,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: typography.sizes.xl * 1.2,
  },
  contractContainer: {
    marginBottom: 24,
  },
  contractTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 16,
  },
  commitmentsList: {
    marginBottom: 20,
  },
  commitmentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commitmentText: {
    fontSize: typography.sizes.sm,
    marginLeft: 8,
    flex: 1,
  },
  trustText: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
  },
  signaturePrompt: {
    fontSize: typography.sizes.md,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },
  signatureCanvasContainer: {
    flex: 1,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
});
