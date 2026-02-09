import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoryStore } from '@/store/useStoryStore';
import { colors, spacing } from '@/constants/colors';

interface AnalyticsScreenProps {
  onNavigate: (screen: string) => void;
}

export default function AnalyticsScreen({ onNavigate }: AnalyticsScreenProps) {
  const { user } = useAuthStore();
  const { stories, isLoading, fetchStories } = useStoryStore();

  useEffect(() => {
    if (user?.id) {
      fetchStories(user.id);
    }
  }, [user]);

  const calculateStats = () => {
    if (stories.length === 0) {
      return {
        totalStories: 0,
        publishedStories: 0,
        averageViralScore: 0,
        bestPerformingStory: null,
      };
    }

    const published = stories.filter(s => s.status === 'published');
    const avgScore = stories.reduce((sum, s) => sum + (s.viralScore || 0), 0) / stories.length;
    const best = stories.reduce((max: any, s) => (s.viralScore > (max?.viralScore || 0) ? s : max), null);

    return {
      totalStories: stories.length,
      publishedStories: published.length,
      averageViralScore: Math.round(avgScore),
      bestPerformingStory: best,
    };
  };

  const stats = calculateStats();

  const StatBox = ({ label, value, unit = '' }: { label: string; value: number | string; unit?: string }) => (
    <View
      style={{
        backgroundColor: colors.background.primary,
        borderRadius: spacing.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
      }}
    >
      <Text style={{ fontSize: 12, color: colors.text.secondary, marginBottom: spacing.sm }}>
        {label}
      </Text>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.primary[700] }}>
        {value}
        <Text style={{ fontSize: 16, color: colors.text.secondary }}>{unit}</Text>
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.secondary }}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: spacing.lg,
        }}
      >
        📊 Analytics
      </Text>

      <StatBox label="Total Stories" value={stats.totalStories} />
      <StatBox label="Published Stories" value={stats.publishedStories} />
      <StatBox label="Average Viral Score" value={stats.averageViralScore} unit="/100" />

      {stats.bestPerformingStory && (
        <View
          style={{
            backgroundColor: colors.accent[50],
            borderRadius: spacing.md,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderLeftWidth: 4,
            borderLeftColor: colors.accent[500],
          }}
        >
          <Text style={{ fontSize: 12, color: colors.text.secondary, marginBottom: spacing.sm }}>
            Best Performing Story
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>
            {stats.bestPerformingStory.title}
          </Text>
          <Text style={{ fontSize: 14, color: colors.accent[700], fontWeight: '600' }}>
            Score: {stats.bestPerformingStory.viralScore}/100
          </Text>
        </View>
      )}

      <View
        style={{
          backgroundColor: colors.secondary[50],
          borderRadius: spacing.md,
          padding: spacing.lg,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.md }}>
          Story Breakdown
        </Text>
        <Text style={{ fontSize: 13, color: colors.text.secondary, marginBottom: spacing.sm }}>
          📝 Real Stories: {stories.filter(s => s.category === 'real').length}
        </Text>
        <Text style={{ fontSize: 13, color: colors.text.secondary, marginBottom: spacing.sm }}>
          ✨ Fictional Stories: {stories.filter(s => s.category === 'fictional').length}
        </Text>
        <Text style={{ fontSize: 13, color: colors.text.secondary }}>
          👻 Anonymous: {stories.filter(s => s.isAnonymous).length}
        </Text>
      </View>
    </ScrollView>
  );
}
