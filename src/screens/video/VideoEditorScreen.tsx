import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { VIDEO_TEMPLATES, VideoTemplate } from '@/constants/VideoTemplates';
import { compositeVideo, shareVideo } from '@/services/video';
import { t } from '@/i18n';

interface VideoEditorScreenProps {
  onNavigate: (screen: string) => void;
  storyId?: string;
  storyContent: string;
  audioUri?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const PREVIEW_HEIGHT = (PREVIEW_WIDTH * 16) / 9;

export default function VideoEditorScreen({ onNavigate, storyId, storyContent, audioUri }: VideoEditorScreenProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate>(VIDEO_TEMPLATES[0]);
  const [overlayText, setOverlayText] = useState(storyContent);
  const [isExporting, setIsExporting] = useState(false);
  const [backgroundType, setBackgroundType] = useState<'color' | 'image'>('color');
  const [backgroundColor, setBackgroundColor] = useState(colors.primary[600]);
  
  const videoRef = useRef<Video>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const videoUri = await compositeVideo({
        storyId: storyId || 'temp',
        userId: 'temp-user',
        templateId: selectedTemplate.id,
        overlayText: overlayText,
        backgroundColor: backgroundColor,
        audioUri: audioUri,
      });

      Alert.alert(
        "Export Successful",
        "Video generated. Would you like to share it?",
        [
          { text: "Later", style: "cancel" },
          { text: "Share", onPress: () => shareVideo(videoUri) }
        ]
      );
    } catch (error) {
      Alert.alert("Export Failed", "There was an error generating your video.");
    } finally {
      setIsExporting(false);
    }
  };

  const TemplateItem = ({ template }: { template: VideoTemplate }) => (
    <TouchableOpacity
      style={[
        styles.templateCard,
        selectedTemplate.id === template.id && styles.selectedTemplateCard
      ]}
      onPress={() => setSelectedTemplate(template)}
    >
      <Ionicons 
        name={
          template.platform === 'tiktok' ? "logo-tiktok" : 
          template.platform === 'reels' ? "logo-instagram" : "play-circle"
        } 
        size={24} 
        color={selectedTemplate.id === template.id ? colors.primary[600] : colors.text.secondary} 
      />
      <Text style={[
        styles.templateName,
        selectedTemplate.id === template.id && styles.selectedTemplateText
      ]}>
        {template.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎬 Video Editor</Text>
        <TouchableOpacity onPress={handleExport} disabled={isExporting}>
          {isExporting ? (
            <ActivityIndicator size="small" color={colors.primary[600]} />
          ) : (
            <Text style={styles.exportBtn}>Export</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.previewContainer}>
          <View style={[
            styles.videoPreview, 
            { backgroundColor: backgroundType === 'color' ? backgroundColor : '#000' }
          ]}>
            {/* Visual representation of the safe area and text overlay */}
            <View style={[
              styles.safeAreaOverlay,
              { 
                paddingTop: selectedTemplate.safeArea.top / 4,
                paddingBottom: selectedTemplate.safeArea.bottom / 4,
                paddingLeft: selectedTemplate.safeArea.left / 4,
                paddingRight: selectedTemplate.safeArea.right / 4,
              }
            ]}>
              <Text style={[
                styles.overlayTextPreview,
                { 
                  fontSize: selectedTemplate.defaultStyles.fontSize / 3,
                  color: selectedTemplate.defaultStyles.color,
                  backgroundColor: selectedTemplate.defaultStyles.backgroundColor,
                  textAlign: selectedTemplate.defaultStyles.textAlign as any,
                }
              ]}>
                {overlayText}
              </Text>
            </View>
            
            {audioUri && (
              <View style={styles.audioIndicator}>
                <Ionicons name="musical-notes" size={20} color="white" />
                <Text style={styles.audioText}>AI Audio Attached</Text>
              </View>
            )}
          </View>
          <Text style={styles.previewHint}>Live Preview (9:16 Aspect Ratio)</Text>
        </View>

        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Select Layout</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
            {VIDEO_TEMPLATES.map(t => (
              <TemplateItem key={t.id} template={t} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Content Overlay</Text>
          <TextInput
            style={styles.textInput}
            multiline
            value={overlayText}
            onChangeText={setOverlayText}
            placeholder="Text to appear in video..."
          />

          <Text style={styles.sectionTitle}>Background Color</Text>
          <View style={styles.colorPicker}>
            {[colors.primary[600], colors.secondary[600], colors.accent[600], '#000000', '#FFFFFF'].map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  backgroundColor === color && styles.selectedColor
                ]}
                onPress={() => {
                  setBackgroundType('color');
                  setBackgroundColor(color);
                }}
              />
            ))}
          </View>
        </View>
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
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  exportBtn: {
    color: colors.primary[700],
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  previewContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.neutral[100],
  },
  videoPreview: {
    width: PREVIEW_WIDTH * 0.7,
    height: PREVIEW_HEIGHT * 0.7,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  safeAreaOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  overlayTextPreview: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    fontWeight: 'bold',
  },
  previewHint: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
  audioIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  audioText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 4,
  },
  controlsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  templateScroll: {
    flexDirection: 'row',
  },
  templateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    width: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTemplateCard: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  templateName: {
    fontSize: 12,
    marginTop: 8,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  selectedTemplateText: {
    color: colors.primary[700],
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: colors.text.primary,
  },
});
