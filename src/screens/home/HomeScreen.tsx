import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoryStore } from '@/store/useStoryStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
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

  const StoryCard = ({ story }: any) => (
    <TouchableOpacity
      onPress={() => {
        onNavigate('StoryDetail');
      }}
      style={{
        backgroundColor: colors.background.primary,
        borderRadius: spacing.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}
      >
        {story.title}
      </Text>
      <Text
        numberOfLines={2}
        style={{
          fontSize: 14,
          color: colors.text.secondary,
          marginBottom: spacing.md,
        }}
      >
        {story.originalContent}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.accent[100],
            borderRadius: spacing.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <Text style={{ color: colors.accent[700], fontWeight: '600', fontSize: 12 }}>
            {t('story.viralScore')}: {Math.round(story.viralScore || 0)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => onNavigate('Voice')}
            style={{
              backgroundColor: colors.primary[50],
              borderRadius: spacing.sm,
              paddingHorizontal: spacing.sm,
              paddingVertical: 4,
              marginRight: spacing.sm,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.primary[700], fontWeight: '600' }}>🎙️ Voice</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              color: colors.text.tertiary,
            }}
          >
            {story.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: colors.text.secondary,
          marginBottom: spacing.md,
          textAlign: 'center',
        }}
      >
        No stories yet
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.text.tertiary,
          textAlign: 'center',
          marginBottom: spacing.lg,
        }}
      >
        Start creating your first viral story now!
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.secondary }}>
      <View
        style={{
          backgroundColor: colors.background.primary,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
          paddingHorizontal: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral[200],
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.primary[700],
            }}
          >
            {t('home.title')}
          </Text>
          <TouchableOpacity
            onPress={() => onNavigate('Profile')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.neutral[200],
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleCreateStory}
          style={{
            backgroundColor: colors.primary[700],
            borderRadius: spacing.md,
            padding: spacing.md,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, marginRight: spacing.sm }}>✨</Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {t('home.createStory')}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[700]} />
        </View>
      ) : stories.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StoryCard story={item} />}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
          }}
        />
      )}
    </View>
  );
}
