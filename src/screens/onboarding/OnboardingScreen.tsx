import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
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
    icon: 'sparkles',
    color: colors.primary[600],
  },
  {
    id: '2',
    title: 'AI Narrations',
    description: 'Breathe life into your stories with professional AI voices using ElevenLabs integration.',
    icon: 'mic',
    color: colors.secondary[600],
  },
  {
    id: '3',
    title: 'Mobile Video Editor',
    description: 'Edit and export videos perfectly formatted for TikTok, Reels, and YouTube Shorts.',
    icon: 'videocam',
    color: colors.accent[600],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onComplete();
    }
  };

  const slide = SLIDES[currentSlideIndex];

  return (
    <View style={[styles.container, { backgroundColor: slide.color }]}>
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Ionicons name={slide.icon as any} size={80} color="white" />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>

        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentSlideIndex === index && styles.activeIndicator
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.nextBtn}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {currentSlideIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons 
              name={currentSlideIndex === SLIDES.length - 1 ? "rocket" : "arrow-forward"} 
              size={20} 
              color={slide.color} 
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
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.md,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  indicatorContainer: {
    flexDirection: 'row',
  },
  indicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral[300],
    marginHorizontal: 3,
  },
  activeIndicator: {
    width: 20,
    backgroundColor: colors.primary[600],
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  nextBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: 8,
  },
});
