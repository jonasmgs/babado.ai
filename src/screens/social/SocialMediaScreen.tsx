import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/colors';
import { connectPlatform, schedulePost, SocialAccount } from '@/services/socialMedia';

interface SocialMediaScreenProps {
  onNavigate: (screen: string, data?: any) => void;
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
      <View style={[styles.platformIcon, { backgroundColor: colors.background.primary }]}>
        <Ionicons 
          name={item.platform === 'tiktok' ? "logo-tiktok" : item.platform === 'instagram' ? "logo-instagram" : "logo-youtube"} 
          size={24} 
          color={item.isConnected ? colors.primary.neon : colors.text.tertiary} 
        />
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.platformName}>{item.platform.toUpperCase()}</Text>
        <Text style={styles.usernameText}>{item.username}</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
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
          <Text style={styles.headerTitle}>Social Media</Text>
          <View style={{ width: 40 }} />
        </View>

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
                    size={22} 
                    color={selectedPlatforms.includes(p) ? 'black' : colors.text.tertiary} 
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
              placeholderTextColor={colors.text.tertiary}
            />

            <TouchableOpacity 
              style={[styles.scheduleBtn, isScheduling && styles.disabledBtn]}
              onPress={handleSchedule}
              disabled={isScheduling}
            >
              {isScheduling ? (
                <ActivityIndicator color="black" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="black" style={{ marginRight: 8 }} />
                  <Text style={styles.scheduleBtnText}>Schedule with AI Magic</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <TouchableOpacity 
            style={styles.analyticsCard}
            onPress={() => onNavigate('Analytics')}
          >
            <View style={styles.analyticsHeader}>
              <View>
                <Text style={styles.analyticsTitle}>Estimated Reach</Text>
                <Text style={styles.analyticsValue}>12,450+</Text>
              </View>
              <View style={styles.reachBadge}>
                <Ionicons name="trending-up" size={20} color={colors.status.success} />
                <Text style={styles.reachPercent}>+12%</Text>
              </View>
            </View>
            <Text style={styles.analyticsHint}>Ver detalhes completos no painel →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 20,
    paddingBottom: spacing.xl,
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
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginLeft: 4,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 20,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  platformIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '700',
  },
  connectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.neon,
  },
  connectedBtn: {
    backgroundColor: colors.primary.neon + '15',
    borderColor: colors.primary.neon + '40',
  },
  connectBtnText: {
    fontSize: 12,
    color: colors.primary.neon,
    fontWeight: '800',
  },
  connectedBtnText: {
    color: colors.primary.neon,
    opacity: 0.8,
  },
  shareBox: {
    backgroundColor: colors.background.secondary,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  platformToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  platformToggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.background.primary,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  selectedPlatformToggle: {
    backgroundColor: colors.primary.neon,
    borderColor: colors.primary.neon,
  },
  platformToggleText: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '700',
    color: colors.text.tertiary,
  },
  selectedPlatformToggleText: {
    color: 'black',
  },
  captionInput: {
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    borderRadius: 16,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  scheduleBtn: {
    backgroundColor: colors.primary.neon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary.neon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  scheduleBtnText: {
    color: 'black',
    fontWeight: '900',
    fontSize: 15,
  },
  analyticsCard: {
    backgroundColor: colors.background.secondary,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.tertiary,
  },
  analyticsValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
  },
  reachBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  reachPercent: {
    color: colors.status.success,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  analyticsHint: {
    fontSize: 12,
    color: colors.primary.neon,
    fontWeight: '700',
  },
});
