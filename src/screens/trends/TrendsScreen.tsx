import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, spacing } from '@/constants/colors';
import { getTrendingTopics, TrendingTopic } from '@/services/trends';

interface TrendsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function TrendsScreen({ onNavigate }: TrendsScreenProps) {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t, language } = useTranslation();

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
      onPress={() => onNavigate('StoryEditor', { topic: item.topic })}
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
          <Text style={styles.metricLabel}>{language === 'pt' ? 'Pontos' : 'Score'}</Text>
          <Text style={styles.metricValue}>{item.popularityScore}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{language === 'pt' ? 'Sentimento' : 'Sentiment'}</Text>
          <Text style={[
            styles.metricValue,
            { color: item.sentiment === 'positive' ? colors.status.success : item.sentiment === 'negative' ? colors.status.error : colors.text.secondary }
          ]}>
             {language === 'pt' ? (item.sentiment === 'positive' ? 'Positivo' : item.sentiment === 'negative' ? 'Negativo' : 'Neutro') : item.sentiment}
          </Text>
        </View>
      </View>

      <View style={styles.hooksContainer}>
        <Text style={styles.hooksLabel}>{t('story.hooks')}:</Text>
        {item.suggestedHooks.map((hook, index) => (
          <Text key={index} style={styles.hookText}>• "{hook}"</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.useTopicBtn}
        onPress={() => onNavigate('StoryEditor', { topic: item.topic })}
      >
        <Text style={styles.useTopicBtnText}>{language === 'pt' ? 'Usar Tópico para Criar História' : 'Use Topic to Create Story'}</Text>
        <Ionicons name="sparkles" size={16} color="black" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => onNavigate('Home')}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('home.trending')}</Text>
        <TouchableOpacity 
          onPress={onRefresh}
          style={styles.refreshBtn}
        >
          <Ionicons name="refresh" size={22} color="#25F4EE" />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#25F4EE" />
          <Text style={styles.loaderText}>{language === 'pt' ? 'Escaneando tendências nas redes sociais...' : 'Scanning social media for trends...'}</Text>
        </View>
      ) : (
        <FlatList
          data={trends}
          renderItem={({ item }) => <TrendItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#25F4EE"
              colors={["#25F4EE"]} 
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.lastUpdated}>Status: Live Tracking</Text>
              <Text style={styles.intro}>{language === 'pt' ? 'Análise em tempo real no TikTok, Instagram e Twitter (X) para encontrar o próximo viral.' : 'Real-time analysis on TikTok, Instagram, and Twitter (X) to find the next viral hit.'}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
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
    paddingHorizontal: spacing.xl,
    paddingTop: 20,
    paddingBottom: spacing.lg,
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
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
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
    color: colors.text.tertiary,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  listHeader: {
    marginBottom: spacing.xl,
    paddingTop: 10,
  },
  lastUpdated: {
    fontSize: 11,
    fontWeight: '700',
    color: "#25F4EE",
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  intro: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  trendCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    padding: 20,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  topicBadge: {
    backgroundColor: 'rgba(37, 244, 238, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 244, 238, 0.3)',
  },
  topicBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: "#25F4EE",
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary + '50',
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.background.glassBorder,
  },
  hooksContainer: {
    marginBottom: 20,
  },
  hooksLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
  },
  hookText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 6,
    opacity: 0.8,
  },
  useTopicBtn: {
    backgroundColor: "#25F4EE",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#25F4EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  useTopicBtnText: {
    color: 'black',
    fontWeight: '900',
    fontSize: 14,
  },
});
