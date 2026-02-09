import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { getAvailableVoices, generateSpeech, Voice, isElevenLabsConfigured } from '@/services/elevenlabs';
import AudioPlayerComponent from '@/components/AudioPlayerComponent';
import { t } from '@/i18n';

interface VoiceScreenProps {
  onNavigate: (screen: string) => void;
  storyId: string;
  storyContent: string;
}

export default function VoiceScreen({ onNavigate, storyId, storyContent }: VoiceScreenProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioUri, setGeneratedAudioUri] = useState<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    if (!isElevenLabsConfigured()) {
      Alert.alert(
        "Missing Configuration",
        "ElevenLabs API Key is not configured. Please add it to your .env file."
      );
      setIsLoading(false);
      return;
    }

    try {
      const availableVoices = await getAvailableVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].voice_id);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      Alert.alert("Error", "Could not load available voices.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNarration = async () => {
    if (!selectedVoice) return;

    setIsGenerating(true);
    try {
      const uri = await generateSpeech(storyContent, selectedVoice);
      setGeneratedAudioUri(uri);
      Alert.alert("Success", "Narration generated successfully!");
    } catch (error) {
      console.error('Error generating narration:', error);
      Alert.alert("Error", "Failed to generate narration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const VoiceItem = ({ item }: { item: Voice }) => (
    <TouchableOpacity
      style={[
        styles.voiceItem,
        selectedVoice === item.voice_id && styles.selectedVoiceItem
      ]}
      onPress={() => setSelectedVoice(item.voice_id)}
    >
      <View style={styles.voiceInfo}>
        <Text style={[
          styles.voiceName,
          selectedVoice === item.voice_id && styles.selectedVoiceText
        ]}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={styles.voiceDesc} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      {selectedVoice === item.voice_id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary[600]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎙️ Voice Narration</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select a Voice</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary[600]} />
          ) : (
            <FlatList
              data={voices}
              renderItem={VoiceItem}
              keyExtractor={(item) => item.voice_id}
              scrollEnabled={false}
              ListEmptyComponent={<Text style={styles.emptyText}>No voices available</Text>}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Story Content Preview</Text>
          <View style={styles.contentPreview}>
            <Text style={styles.contentText} numberOfLines={5}>
              {storyContent}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.disabledButton]}
          onPress={handleGenerateNarration}
          disabled={isGenerating || !selectedVoice}
        >
          {isGenerating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="mic" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.generateButtonText}>Generate AI Narration</Text>
            </>
          )}
        </TouchableOpacity>

        {generatedAudioUri && (
          <View style={styles.audioSection}>
            <Text style={styles.sectionTitle}>3. Listen & Preview</Text>
            <AudioPlayerComponent uri={generatedAudioUri} title="Generated Narration" />
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => onNavigate('VideoEditor')}
            >
              <Text style={styles.continueButtonText}>Continue to Video Editor</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedVoiceItem: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  selectedVoiceText: {
    color: colors.primary[700],
  },
  voiceDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
  contentPreview: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  contentText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: colors.primary[700],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  disabledButton: {
    backgroundColor: colors.neutral[400],
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioSection: {
    marginTop: spacing.xl,
  },
  continueButton: {
    backgroundColor: colors.secondary[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
