import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import I18n, { setLanguage } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

interface SettingsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [language, setLanguageState] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'pt') => {
    setLanguageState(lang);
    setLanguage(lang);
    Alert.alert('Language Updated', `Application language changed to ${lang === 'en' ? 'English' : 'Português'}.`);
  };

  const showInfo = (title: string, content: string) => {
    Alert.alert(title, content);
  };

  const SettingItem = ({
    icon,
    label,
    value,
    onPress,
    hasToggle = false,
    toggleValue = false,
    onToggle,
    color = colors.primary.neon,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={hasToggle}
      style={styles.settingItem}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#334155', true: colors.primary.neon + '40' }}
          thumbColor={toggleValue ? colors.primary.neon : '#94a3b8'}
        />
      ) : (
        onPress && <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
      )}
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="language-outline"
            label="Language"
            value={language === 'en' ? 'English' : 'Português'}
            onPress={() => handleLanguageChange(language === 'en' ? 'pt' : 'en')}
            color="#6366f1"
          />

          <SettingItem
            icon="notifications-outline"
            label="Notifications"
            hasToggle
            toggleValue={notificationsEnabled}
            onToggle={setNotificationsEnabled}
            color="#ec4899"
          />

          <SettingItem
            icon="moon-outline"
            label="Dark Mode"
            hasToggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
            color="#8b5cf6"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="information-circle-outline"
            label="About Babado.ai"
            value="Version 1.1.0"
            onPress={() => showInfo('About Babado.ai', 'The ultimate storytelling app powered by AI. Create, rewrite, and share viral stories across social media!')}
            color="#64748b"
          />

          <SettingItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => showInfo('Privacy Policy', 'Your privacy is our priority. We only use your data to improve your storytelling experience.')}
            color="#10b981"
          />

          <SettingItem
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => showInfo('Terms of Service', 'By using Babado.ai, you agree to create respectful content and follow social media platform guidelines.')}
            color="#f59e0b"
          />
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 14,
    borderRadius: 20,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  settingValue: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
