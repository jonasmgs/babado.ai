import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoryStore } from '@/store/useStoryStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuthStore();
  const { stories, isLoading, fetchStories } = useStoryStore();

  useEffect(() => {
    if (user?.id) {
      fetchStories(user.id);
    }
  }, [user]);

  const handleCreateStory = () => {
    onNavigate('StoryEditor');
  };

  const getViralColor = (score: number) => {
    if (score > 80) return colors.accent.pink;
    if (score > 50) return colors.primary.neon;
    return colors.secondary[400];
  };

  const StoryCard = ({ story }: any) => {
    const viralColor = getViralColor(story.viralScore || 0);
    
    return (
      <TouchableOpacity
        onPress={() => onNavigate('StoryDetail', { storyId: story.id })}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{story.title}</Text>
          <View style={[styles.badge, { backgroundColor: viralColor + '20', borderColor: viralColor }]}>
            <Ionicons name="trending-up" size={12} color={viralColor} />
            <Text style={[styles.badgeText, { color: viralColor }]}>
              {Math.round(story.viralScore || 0)}%
            </Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.cardContent}>
          {story.originalContent}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.tagContainer}>
            <Ionicons name="pricetag-outline" size={12} color={colors.text.tertiary} />
            <Text style={styles.tagText}>{story.category || 'General'}</Text>
          </View>
          
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => onNavigate('Voice', { storyId: story.id, storyContent: story.originalContent })}
              style={styles.iconBtn}
            >
              <Ionicons name="mic-outline" size={20} color={colors.primary.neon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onNavigate('VideoEditor', { storyId: story.id, storyContent: story.originalContent })}
              style={styles.iconBtn}
            >
              <Ionicons name="videocam-outline" size={20} color={colors.secondary[400]} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="document-text-outline" size={48} color={colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>No stories yet</Text>
      <Text style={styles.emptySubtitle}>
        Your creative journey starts here. Create your first story and let AI do the magic!
      </Text>
      <TouchableOpacity style={styles.createBtnLarge} onPress={handleCreateStory}>
        <Text style={styles.createBtnTextLarge}>Start Creating</Text>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, {user?.username || 'Creator'}</Text>
          <Text style={styles.headerSubtitle}>Design your next viral babado</Text>
        </View>
        <TouchableOpacity 
          onPress={() => onNavigate('Profile')}
          style={styles.profileAvatar}
        >
          <Ionicons name="person-circle-outline" size={32} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Floating Action Header */}
      <View style={styles.actionHeader}>
        <TouchableOpacity
          onPress={handleCreateStory}
          style={styles.createBtn}
        >
          <Ionicons name="sparkles" size={18} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.createBtnText}>New Story</Text>
        </TouchableOpacity>
        
        <View style={styles.statsOverview}>
          <Ionicons name="flame" size={16} color={colors.accent.pink} />
          <Text style={styles.statsText}>{stories.length} Stories</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.neon} />
        </View>
      ) : stories.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StoryCard story={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  createBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  statsOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  statsText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  cardContent: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.background.glassBorder,
    paddingTop: spacing.md,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  actionRow: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  createBtnLarge: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  createBtnTextLarge: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
  },
});
