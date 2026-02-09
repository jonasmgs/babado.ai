import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { getTrendingTopics, TrendingTopic } from '@/services/trends';

interface TrendsScreenProps {
  onNavigate: (screen: string) => void;
}

export default function TrendsScreen({ onNavigate }: TrendsScreenProps) {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setIsLoading(true);
    try {
      const data = await getTrendingTopics();
      setTrends(data);
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrends();
    setRefreshing(false);
  };

  const TrendItem = ({ item }: { item: TrendingTopic }) => (
    <TouchableOpacity 
      style={styles.trendCard}
      onPress={() => onNavigate('StoryEditor')}
    >
      <View style={styles.trendHeader}>
        <View style={styles.topicBadge}>
          <Text style={styles.topicBadgeText}>{item.platform.toUpperCase()}</Text>
        </View>
        <View style={styles.growthBadge}>
          <Ionicons 
            name={item.growthRate >= 0 ? "trending-up" : "trending-down"} 
            size={14} 
            color={item.growthRate >= 0 ? colors.status.success : colors.status.error} 
          />
          <Text style={[
            styles.growthText,
            { color: item.growthRate >= 0 ? colors.status.success : colors.status.error }
          ]}>
            {Math.abs(item.growthRate)}%
          </Text>
        </View>
      </View>
      
      <Text style={styles.topicTitle}>{item.topic}</Text>
      
      <View style={styles.metricRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Score</Text>
          <Text style={styles.metricValue}>{item.popularityScore}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Sentiment</Text>
          <Text style={[
            styles.metricValue,
            { color: item.sentiment === 'positive' ? colors.status.success : item.sentiment === 'negative' ? colors.status.error : colors.text.secondary }
          ]}>
            {item.sentiment}
          </Text>
        </View>
      </View>

      <View style={styles.hooksContainer}>
        <Text style={styles.hooksLabel}>Suggest Hooks:</Text>
        {item.suggestedHooks.map((hook, index) => (
          <Text key={index} style={styles.hookText}>• "{hook}"</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.useTopicBtn}
        onPress={() => onNavigate('StoryEditor')}
      >
        <Text style={styles.useTopicBtnText}>Use Topic to Create Story</Text>
        <Ionicons name="sparkles" size={16} color="white" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 Global Trends</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loaderText}>Scanning social media for trends...</Text>
        </View>
      ) : (
        <FlatList
          data={trends}
          renderItem={TrendItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary[600]]} />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.lastUpdated}>Last updated: Just now</Text>
              <Text style={styles.intro}>Analysis across TikTok, Instagram, and Twitter (X) to find viral potential for your next story.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loaderText: {
    marginTop: spacing.md,
    color: colors.text.secondary,
    fontSize: 14,
  },
  listContent: {
    padding: spacing.lg,
  },
  listHeader: {
    marginBottom: spacing.lg,
  },
  lastUpdated: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  intro: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  trendCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  topicBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  topicBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary[700],
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  growthText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.neutral[300],
  },
  hooksContainer: {
    backgroundColor: 'white',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  hooksLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  hookText: {
    fontSize: 12,
    color: colors.text.primary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  useTopicBtn: {
    backgroundColor: colors.primary[700],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  useTopicBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
