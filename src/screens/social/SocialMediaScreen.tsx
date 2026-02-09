import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Switch,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { connectPlatform, schedulePost, SocialAccount, ScheduledPost } from '@/services/socialMedia';

interface SocialMediaScreenProps {
  onNavigate: (screen: string) => void;
  storyId?: string;
}

export default function SocialMediaScreen({ onNavigate, storyId }: SocialMediaScreenProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'tiktok', username: '@babado_creator', isConnected: true },
    { id: '2', platform: 'instagram', username: 'Not connected', isConnected: false },
    { id: '3', platform: 'youtube', username: 'Not connected', isConnected: false },
  ]);

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok']);
  const [caption, setCaption] = useState('Check out this amazing viral story! 🔥 #viral #babado');
  const [isScheduling, setIsScheduling] = useState(false);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      const newAccount = await connectPlatform(platform);
      setAccounts(accounts.map(acc => 
        acc.platform === platform ? { ...newAccount, isConnected: true } : acc
      ));
      Alert.alert("Success", `${platform} connected successfully!`);
    } catch (error) {
      Alert.alert("Error", `Could not connect ${platform}`);
    }
  };

  const handleSchedule = async () => {
    if (selectedPlatforms.length === 0) {
      Alert.alert("Error", "Please select at least one platform");
      return;
    }

    setIsScheduling(true);
    try {
      await schedulePost({
        storyId: storyId || 'temp',
        platforms: selectedPlatforms as any,
        caption,
        scheduledAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Post scheduled successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to schedule post");
    } finally {
      setIsScheduling(false);
    }
  };

  const AccountItem = ({ item }: { item: SocialAccount }) => (
    <View style={styles.accountCard}>
      <View style={styles.platformIcon}>
        <Ionicons 
          name={item.platform === 'tiktok' ? "logo-tiktok" : item.platform === 'instagram' ? "logo-instagram" : "logo-youtube"} 
          size={32} 
          color={colors.text.primary} 
        />
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.platformName}>{item.platform.toUpperCase()}</Text>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.connectBtn, item.isConnected && styles.connectedBtn]}
        onPress={() => !item.isConnected && handleConnect(item.platform)}
      >
        <Text style={[styles.connectBtnText, item.isConnected && styles.connectedBtnText]}>
          {item.isConnected ? 'Connected' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔗 Social Media</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          {accounts.map(acc => <AccountItem key={acc.id} item={acc} />)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Your Story</Text>
          <View style={styles.shareBox}>
            <Text style={styles.label}>Select Platforms</Text>
            <View style={styles.platformToggleRow}>
              {['tiktok', 'instagram', 'youtube'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.platformToggle,
                    selectedPlatforms.includes(p) && styles.selectedPlatformToggle
                  ]}
                  onPress={() => togglePlatform(p)}
                >
                  <Ionicons 
                    name={p === 'tiktok' ? "logo-tiktok" : p === 'instagram' ? "logo-instagram" : "logo-youtube"} 
                    size={24} 
                    color={selectedPlatforms.includes(p) ? 'white' : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.platformToggleText,
                    selectedPlatforms.includes(p) && styles.selectedPlatformToggleText
                  ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              multiline
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a catchy caption..."
            />

            <TouchableOpacity 
              style={[styles.scheduleBtn, isScheduling && styles.disabledBtn]}
              onPress={handleSchedule}
              disabled={isScheduling}
            >
              {isScheduling ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="calendar" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.scheduleBtnText}>Schedule Post</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Analytics</Text>
          <TouchableOpacity 
            style={styles.analyticsCard}
            onPress={() => onNavigate('Analytics')}
          >
            <View style={styles.analyticsHeader}>
              <View>
                <Text style={styles.analyticsTitle}>Total Reach</Text>
                <Text style={styles.analyticsValue}>12,450</Text>
              </View>
              <Ionicons name="trending-up" size={32} color={colors.status.success} />
            </View>
            <Text style={styles.analyticsHint}>View detailed breakdown in Analytics →</Text>
          </TouchableOpacity>
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
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  platformIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.tertiary,
  },
  username: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  connectBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[600],
  },
  connectedBtn: {
    backgroundColor: colors.primary[50],
    borderColor: 'transparent',
  },
  connectBtnText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '600',
  },
  connectedBtnText: {
    color: colors.primary[400],
  },
  shareBox: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  platformToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  platformToggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  selectedPlatformToggle: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  platformToggleText: {
    fontSize: 10,
    marginTop: 4,
    color: colors.text.secondary,
  },
  selectedPlatformToggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  captionInput: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
    fontSize: 14,
  },
  scheduleBtn: {
    backgroundColor: colors.primary[700],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  scheduleBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  analyticsCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.success,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  analyticsTitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  analyticsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  analyticsHint: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '600',
  },
});
