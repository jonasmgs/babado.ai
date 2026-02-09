import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useStoryStore } from '@/store/useStoryStore';
import { useAuthStore } from '@/store/useAuthStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { EmotionalTone } from '@/types';

interface StoryEditorScreenProps {
  onNavigate: (screen: string) => void;
}

export default function StoryEditorScreen({ onNavigate }: StoryEditorScreenProps) {
  const { user } = useAuthStore();
  const { createStory, isLoading } = useStoryStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'real' | 'fictional'>('real');
  const [emotionalTone, setEmotionalTone] = useState<EmotionalTone>('dramatic');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const tones: EmotionalTone[] = ['dramatic', 'humorous', 'inspirational', 'sarcastic', 'mysterious', 'nostalgic'];

  const handlePublish = async () => {
    if (!user?.id || !title || !content) {
      alert('Please fill in all fields');
      return;
    }

    const newStory = await createStory({
      userId: user.id,
      title,
      originalContent: content,
      category,
      emotionalTone,
      isAnonymous,
      status: 'draft',
      viralScore: 0,
      tags: [],
    });

    if (newStory) {
      alert('Story created successfully!');
      onNavigate('Home');
    }
  };

  const CategoryButton = ({ type, label }: { type: 'real' | 'fictional'; label: string }) => (
    <TouchableOpacity
      onPress={() => setCategory(type)}
      style={{
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: spacing.md,
        borderWidth: 2,
        borderColor: category === type ? colors.primary[700] : colors.neutral[300],
        backgroundColor: category === type ? colors.primary[100] : colors.background.primary,
        marginHorizontal: spacing.sm,
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          color: category === type ? colors.primary[700] : colors.text.secondary,
          fontWeight: '600',
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ToneButton = ({ tone }: { tone: EmotionalTone }) => (
    <TouchableOpacity
      onPress={() => setEmotionalTone(tone)}
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: spacing.md,
        borderWidth: 1,
        borderColor: emotionalTone === tone ? colors.primary[600] : colors.neutral[300],
        backgroundColor: emotionalTone === tone ? colors.primary[100] : colors.background.secondary,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
      }}
    >
      <Text
        style={{
          color: emotionalTone === tone ? colors.primary[700] : colors.text.secondary,
          fontWeight: '500',
          fontSize: 12,
        }}
      >
        {t(`story.${tone}`)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: spacing.lg,
        }}
      >
        ✨ Create Your Story
      </Text>

      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
          Story Title
        </Text>
        <TextInput
          placeholder="Give your story a captivating title..."
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: colors.neutral[300],
            borderRadius: spacing.md,
            padding: spacing.md,
            fontSize: 16,
            color: colors.text.primary,
          }}
        />
      </View>

      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
          {t('story.category')}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <CategoryButton type="real" label={t('story.real')} />
          <CategoryButton type="fictional" label={t('story.fictional')} />
        </View>
      </View>

      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
          Your Story
        </Text>
        <TextInput
          placeholder={t('story.content')}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          style={{
            borderWidth: 1,
            borderColor: colors.neutral[300],
            borderRadius: spacing.md,
            padding: spacing.md,
            fontSize: 16,
            color: colors.text.primary,
          }}
        />
      </View>

      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.md }}>
          {t('story.emotionalTone')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {tones.map((tone) => (
            <ToneButton key={tone} tone={tone} />
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.background.secondary,
          borderRadius: spacing.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary }}>
          {t('story.anonymous')}
        </Text>
        <Switch
          value={isAnonymous}
          onValueChange={setIsAnonymous}
          trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
          thumbColor={isAnonymous ? colors.primary[700] : colors.neutral[400]}
        />
      </View>

      <TouchableOpacity
        onPress={handlePublish}
        disabled={isLoading}
        style={{
          backgroundColor: colors.primary[700],
          borderRadius: spacing.md,
          paddingVertical: spacing.md,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {t('story.publish')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
