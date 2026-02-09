import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoryStore } from '@/store/useStoryStore';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface AnalyticsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
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

  const StatBox = ({ label, value, unit = '', icon, color }: { label: string; value: number | string; unit?: string; icon: string; color: string }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statUnit}>{unit}</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.neon} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => onNavigate('Home')}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsGrid}>
          <StatBox 
            label="Total Stories" 
            value={stats.totalStories} 
            icon="document-text-outline" 
            color={colors.primary.neon} 
          />
          <StatBox 
            label="Viral Average" 
            value={stats.averageViralScore} 
            unit="%" 
            icon="trending-up" 
            color={colors.accent.pink} 
          />
        </View>

        {stats.bestPerformingStory && (
          <View style={styles.bestStoryCard}>
            <View style={styles.bestHeader}>
              <View style={styles.trophyIcon}>
                <Ionicons name="trophy" size={20} color="#fbbf24" />
              </View>
              <Text style={styles.bestLabel}>Best Performing Story</Text>
            </View>
            <Text style={styles.bestTitle}>{stats.bestPerformingStory.title}</Text>
            <View style={styles.bestFooter}>
              <View style={styles.bestScoreBadge}>
                <Text style={styles.bestScoreText}>{stats.bestPerformingStory.viralScore}% Viral Potential</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Content Insights</Text>
          
          <View style={styles.insightRow}>
            <View style={styles.insightLabelRow}>
              <Ionicons name="videocam-outline" size={18} color={colors.secondary[400]} />
              <Text style={styles.insightName}>Real Stories</Text>
            </View>
            <Text style={styles.insightValue}>{stories.filter(s => s.category === 'real').length}</Text>
          </View>

          <View style={styles.insightRow}>
            <View style={styles.insightLabelRow}>
              <Ionicons name="sparkles-outline" size={18} color={colors.primary.neon} />
              <Text style={styles.insightName}>Fictional Content</Text>
            </View>
            <Text style={styles.insightValue}>{stories.filter(s => s.category === 'fictional').length}</Text>
          </View>

          <View style={[styles.insightRow, { borderBottomWidth: 0 }]}>
            <View style={styles.insightLabelRow}>
              <Ionicons name="eye-off-outline" size={18} color={colors.text.tertiary} />
              <Text style={styles.insightName}>Anonymous</Text>
            </View>
            <Text style={styles.insightValue}>{stories.filter(s => s.isAnonymous).length}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 20,
    paddingBottom: spacing.xxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
  },
  statUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.tertiary,
    marginLeft: 2,
  },
  bestStoryCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: '#1e1b4b',
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  bestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  trophyIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bestLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fbbf24',
    textTransform: 'uppercase',
  },
  bestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  bestFooter: {
    alignSelf: 'flex-start',
  },
  bestScoreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },
  bestScoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  breakdownCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth:1,
    borderBottomColor: colors.background.glassBorder,
  },
  insightLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: 12,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
