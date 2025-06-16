import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PenTool, RotateCcw, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function SignatureScreen() {
  const router = useRouter();
  const { isDarkMode, personalInfo, signContract } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const pathRef = useRef('');

  const { width } = Dimensions.get('window');
  const signatureAreaHeight = 200;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const newPath = `M${locationX.toFixed(2)},${locationY.toFixed(2)}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const newPath = `${pathRef.current} L${locationX.toFixed(2)},${locationY.toFixed(2)}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderRelease: () => {
      setPaths(prev => [...prev, pathRef.current]);
      setCurrentPath('');
      pathRef.current = '';
    },
  });

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const handleContinue = () => {
    if (paths.length === 0 && currentPath === '') {
      return; // Don't allow continue without signature
    }
    
    signContract();
    router.push('/onboarding/complete');
  };

  const hasSignature = paths.length > 0 || currentPath !== '';

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
            <PenTool size={48} color={theme.primary} />
          </View>
          
          <Text style={[styles.title, { color: theme.text }]}>
            {personalInfo.name ? `${personalInfo.name}, let's make a contract` : "Let's make a contract"}
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
            And I trust Voice of the Shepherd to guide me along the way and help me accomplish my spiritual resolutions.
          </Text>
        </View>

        <View style={styles.signatureContainer}>
          <Text style={[styles.signatureLabel, { color: theme.text }]}>
            Sign your name using your finger
          </Text>
          
          <View 
            style={[
              styles.signatureArea, 
              { 
                backgroundColor: theme.card, 
                borderColor: hasSignature ? theme.primary : theme.border,
                borderWidth: hasSignature ? 2 : 1,
              }
            ]}
            {...panResponder.panHandlers}
          >
            <Svg height={signatureAreaHeight} width={width - 64}>
              {paths.map((path, index) => (
                <Path
                  key={index}
                  d={path}
                  stroke={theme.primary}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentPath !== '' && (
                <Path
                  d={currentPath}
                  stroke={theme.primary}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
            </Svg>
            
            {!hasSignature && (
              <View style={styles.placeholderContainer}>
                <Text style={[styles.placeholderText, { color: theme.secondary }]}>
                  Sign here
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.disclaimerText, { color: theme.secondary }]}>
            * Your signature will not be recorded or stored
          </Text>
        </View>

        {hasSignature && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSignature}
            activeOpacity={0.7}
          >
            <RotateCcw size={16} color={theme.secondary} />
            <Text style={[styles.clearButtonText, { color: theme.secondary }]}>
              Clear signature
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton, 
            { 
              backgroundColor: hasSignature ? theme.primary : theme.muted,
              opacity: hasSignature ? 1 : 0.5,
            }
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!hasSignature}
        >
          <Text style={styles.continueButtonText}>I commit to myself</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.quoteFont,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: typography.sizes.xl * 1.2,
  },
  contractContainer: {
    marginBottom: 32,
  },
  contractTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    marginBottom: 16,
  },
  commitmentsList: {
    marginBottom: 20,
  },
  commitmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  signatureContainer: {
    marginBottom: 16,
  },
  signatureLabel: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  signatureArea: {
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: typography.sizes.md,
    fontStyle: 'italic',
  },
  disclaimerText: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: typography.sizes.sm,
    marginLeft: 6,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  continueButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: '700',
  },
});