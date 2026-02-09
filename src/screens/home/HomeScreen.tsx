import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoryStore } from '@/store/useStoryStore';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuthStore();
  const { stories, isLoading, fetchStories } = useStoryStore();
  const { t } = useTranslation();
  
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user?.id) {
      fetchStories(user.id);
    }
  }, [user]);

  const handleCreateStory = () => {
    onNavigate('StoryEditor');
  };

  const VerticalStoryCard = ({ story, index }: any) => {
    const viralColor = story.viralScore > 80 ? '#FE2C55' : story.viralScore > 50 ? '#25F4EE' : '#ffffff';

    return (
      <View style={[styles.fullScreenCard, { height: SCREEN_HEIGHT - 60 }]}>
        {/* Background Gradient Simulator (Using color opacity) */}
        <View style={[styles.backgroundOverlay, { backgroundColor: index % 2 === 0 ? '#121212' : '#010101' }]} />
        
        {/* Content Container */}
        <View style={styles.contentOverlay}>
          
          {/* Bottom Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.authorName}>@{user?.username || 'Creator'}</Text>
            <Text style={styles.storyTitle} numberOfLines={2}>{story.title}</Text>
            <View style={styles.tagRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{story.category === 'real' ? t('story.real') : t('story.fictional')}</Text>
              </View>
              <View style={styles.viralBadge}>
                <Ionicons name="flame" size={14} color={viralColor} />
                <Text style={[styles.viralText, { color: viralColor }]}>{Math.round(story.viralScore || 0)}% Viral</Text>
              </View>
            </View>
            <Text style={styles.storyPreview} numberOfLines={3}>{story.originalContent}</Text>
          </View>

          {/* Right Action Bar */}
          <View style={styles.rightBar}>
            <TouchableOpacity style={styles.actionCircle} onPress={() => onNavigate('Profile')}>
               <Ionicons name="person-circle" size={45} color="white" />
               <View style={styles.plusOverlay}>
                 <Ionicons name="add" size={12} color="white" />
               </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => onNavigate('Voice', { storyId: story.id, storyContent: story.originalContent })}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="mic" size={28} color="white" />
              </View>
              <Text style={styles.actionText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => onNavigate('VideoEditor', { storyId: story.id, storyContent: story.originalContent })}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="videocam" size={28} color="#FE2C55" />
              </View>
              <Text style={styles.actionText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => onNavigate('Analytics', { storyId: story.id })}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="stats-chart" size={24} color="#25F4EE" />
              </View>
              <Text style={styles.actionText}>Stats</Text>
            </TouchableOpacity>

            <Animated.View style={styles.musicDisk}>
              <Ionicons name="musical-notes" size={20} color="white" />
            </Animated.View>
          </View>

        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="duplicate-outline" size={80} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>Feed Empty</Text>
      <Text style={styles.emptySubtitle}>{t('home.title')}</Text>
      <TouchableOpacity style={styles.createBtnTikTok} onPress={handleCreateStory}>
        <Text style={styles.createBtnTextTikTok}>{t('home.createStory')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Top Tabs Simulator */}
      <SafeAreaView style={styles.topTabs}>
        <TouchableOpacity>
          <Text style={styles.tabText}>Following</Text>
        </TouchableOpacity>
        <View style={styles.tabSeparator} />
        <TouchableOpacity>
          <Text style={[styles.tabText, styles.activeTabText]}>For You</Text>
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Vertical Feed */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25F4EE" />
        </View>
      ) : stories.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <VerticalStoryCard story={item} index={index} />}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={SCREEN_HEIGHT - 60}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      )}

      {/* Bottom Nav Bar Simulator */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Home')}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Trends')}>
          <Ionicons name="search" size={24} color="#94a3b8" />
          <Text style={[styles.navText, { color: '#94a3b8' }]}>Trends</Text>
        </TouchableOpacity>
        
        {/* Central Plus Button */}
        <TouchableOpacity style={styles.createMainBtn} onPress={handleCreateStory}>
          <View style={styles.plusIconBg}>
            <Ionicons name="add" size={28} color="black" />
          </View>
          <View style={styles.plusLeftCyan} />
          <View style={styles.plusRightRed} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Notifications')}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#94a3b8" />
          <Text style={[styles.navText, { color: '#94a3b8' }]}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Profile')}>
          <Ionicons name="person" size={24} color="#94a3b8" />
          <Text style={[styles.navText, { color: '#94a3b8' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topTabs: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 15,
  },
  activeTabText: {
    color: 'white',
  },
  tabSeparator: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 2,
    backgroundColor: 'white',
  },
  fullScreenCard: {
    width: SCREEN_WIDTH,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  infoSection: {
    paddingHorizontal: 15,
    paddingRight: 80,
    marginBottom: 20,
  },
  authorName: {
    color: 'white',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8,
  },
  storyTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.9,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  viralBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  viralText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  storyPreview: {
    color: 'white',
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
  },
  rightBar: {
    position: 'absolute',
    right: 10,
    bottom: 40,
    alignItems: 'center',
  },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  plusOverlay: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#FE2C55',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  actionBtn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  musicDisk: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#111',
    marginTop: 10,
  },
  bottomNav: {
    height: 60,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  createMainBtn: {
    width: 45,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconBg: {
    backgroundColor: 'white',
    width: 38,
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  plusLeftCyan: {
    position: 'absolute',
    left: 0,
    width: 12,
    height: '100%',
    backgroundColor: '#25F4EE',
    borderRadius: 8,
    zIndex: 1,
  },
  plusRightRed: {
    position: 'absolute',
    right: 0,
    width: 12,
    height: '100%',
    backgroundColor: '#FE2C55',
    borderRadius: 8,
    zIndex: 1,
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
    padding: 40,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 20,
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  createBtnTikTok: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 30,
  },
  createBtnTextTikTok: {
    color: 'black',
    fontWeight: '900',
    fontSize: 15,
  },
});
