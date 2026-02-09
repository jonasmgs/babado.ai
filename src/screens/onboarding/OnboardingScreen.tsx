import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Create Viral Stories',
    description: 'Use the power of AI to transform your ideas into compelling stories that go viral.',
    icon: 'sparkles-outline',
    color: '#a78bfa',
    highlight: '#c4b5fd',
  },
  {
    id: '2',
    title: 'AI Narrations',
    description: 'Breathe life into your stories with professional AI voices using ElevenLabs integration.',
    icon: 'mic-outline',
    color: '#22d3ee',
    highlight: '#67e8f9',
  },
  {
    id: '3',
    title: 'Video Editor',
    description: 'Edit and export videos perfectly formatted for TikTok, Reels, and YouTube Shorts.',
    icon: 'videocam-outline',
    color: '#f472b6',
    highlight: '#fb7185',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onComplete();
    }
  };

  const slide = SLIDES[currentSlideIndex];

  return (
    <View style={styles.container}>
      {/* Dynamic Background Elements */}
      <View style={[styles.bgCircle, { top: -100, left: -50, backgroundColor: slide.color, opacity: 0.15 }]} />
      <View style={[styles.bgCircle, { bottom: -150, right: -100, backgroundColor: slide.highlight, opacity: 0.1 }]} />

      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={[styles.iconGlass, { borderColor: slide.color }]}>
            <View style={[styles.iconInner, { backgroundColor: slide.color + '20' }]}>
              <Ionicons name={slide.icon as any} size={70} color={slide.color} />
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentSlideIndex === index && { width: 24, backgroundColor: slide.color }
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.nextBtn, { backgroundColor: slide.color }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {currentSlideIndex === SLIDES.length - 1 ? 'Start Magic' : 'Continue'}
            </Text>
            <Ionicons 
              name={currentSlideIndex === SLIDES.length - 1 ? "flash" : "chevron-forward"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  bgCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGlass: {
    width: 180,
    height: 180,
    borderRadius: 50,
    borderWidth: 1,
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.8,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text.primary,
    lineHeight: 48,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 18,
    color: colors.text.secondary,
    lineHeight: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral[700],
    marginHorizontal: 4,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginRight: 8,
  },
});
