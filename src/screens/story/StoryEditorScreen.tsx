import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useStoryStore } from '@/store/useStoryStore';
import { useAuthStore } from '@/store/useAuthStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { EmotionalTone } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface StoryEditorScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function StoryEditorScreen({ onNavigate }: StoryEditorScreenProps) {
  const { user } = useAuthStore();
  const { createStory, isLoading } = useStoryStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'real' | 'fictional'>('real');
  const [emotionalTone, setEmotionalTone] = useState<EmotionalTone>('dramatic');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const tones: { type: EmotionalTone; icon: string; color: string }[] = [
    { type: 'dramatic', icon: 'flash', color: '#f43f5e' },
    { type: 'humorous', icon: 'happy', color: '#f59e0b' },
    { type: 'inspirational', icon: 'sunny', color: '#10b981' },
    { type: 'sarcastic', icon: 'skull', color: '#8b5cf6' },
    { type: 'mysterious', icon: 'moon', color: '#6366f1' },
    { type: 'nostalgic', icon: 'time', color: '#ec4899' },
  ];

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

  const CategoryButton = ({ type, label, icon }: { type: 'real' | 'fictional'; label: string; icon: string }) => (
    <TouchableOpacity
      onPress={() => setCategory(type)}
      style={[
        styles.catBtn,
        category === type && styles.catBtnActive
      ]}
    >
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={category === type ? 'white' : colors.text.secondary} 
      />
      <Text style={[
        styles.catBtnText,
        category === type && styles.catBtnTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
          <Text style={styles.headerTitle}>New Story</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Title Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Engaging Title</Text>
            <TextInput
              placeholder="Ex: The secret behind the viral..."
              placeholderTextColor={colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
            />
          </View>

          {/* Category Selector */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Type of Babado</Text>
            <View style={styles.catRow}>
              <CategoryButton type="real" label="Real Facts" icon="videocam-outline" />
              <CategoryButton type="fictional" label="Fictional" icon="sparkles-outline" />
            </View>
          </View>

          {/* Emotional Tone Pills */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Emotional Vibe</Text>
            <View style={styles.toneGrid}>
              {tones.map((tone) => (
                <TouchableOpacity
                  key={tone.type}
                  onPress={() => setEmotionalTone(tone.type)}
                  style={[
                    styles.tonePill,
                    emotionalTone === tone.type && { backgroundColor: tone.color + '20', borderColor: tone.color }
                  ]}
                >
                  <Ionicons 
                    name={tone.icon as any} 
                    size={14} 
                    color={emotionalTone === tone.type ? tone.color : colors.text.tertiary} 
                  />
                  <Text style={[
                    styles.toneText,
                    emotionalTone === tone.type && { color: tone.color, fontWeight: '700' }
                  ]}>
                    {t(`story.${tone.type}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Main Content Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Story Context</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                placeholder="Spill the tea here..."
                placeholderTextColor={colors.text.tertiary}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                style={styles.textArea}
              />
            </View>
          </View>

          {/* Anonymous Switch */}
          <View style={styles.switchCard}>
            <View style={styles.switchInfo}>
              <Ionicons name="eye-off-outline" size={20} color={colors.text.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.switchLabel}>Post Anonymously</Text>
                <Text style={styles.switchSublabel}>Hide your identity from others</Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: colors.background.tertiary, true: colors.primary[400] }}
              thumbColor={isAnonymous ? colors.primary.neon : colors.text.tertiary}
            />
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handlePublish}
            disabled={isLoading}
            style={[styles.publishBtn, isLoading && { opacity: 0.7 }]}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.publishBtnText}>Cast Content Magic</Text>
                <Ionicons name="flash" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: 60,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: spacing.xl,
  },
  inputWrapper: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titleInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    fontWeight: '600',
  },
  catRow: {
    flexDirection: 'row',
  },
  catBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    marginRight: spacing.sm,
  },
  catBtnActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary.neon,
  },
  catBtnText: {
    color: colors.text.secondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  catBtnTextActive: {
    color: 'white',
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    margin: 4,
  },
  toneText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  textAreaContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    minHeight: 180,
  },
  textArea: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    marginBottom: spacing.xxl,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  switchSublabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  publishBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  publishBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 12,
  },
});
