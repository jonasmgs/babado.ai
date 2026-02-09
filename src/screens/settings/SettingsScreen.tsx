import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import I18n, { setLanguage } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
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
  }: any) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
      }}
    >
      <Text style={{ fontSize: 20, marginRight: spacing.md }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
          {label}
        </Text>
        {value && <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: spacing.sm }}>{value}</Text>}
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
          thumbColor={toggleValue ? colors.primary[700] : colors.neutral[400]}
        />
      ) : (
        onPress && <Text style={{ fontSize: 18, color: colors.text.tertiary }}>›</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          backgroundColor: colors.background.secondary,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral[200],
        }}
      >
        <TouchableOpacity 
          onPress={() => onNavigate('Home')}
          style={{ marginRight: spacing.md }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text.primary,
          }}
        >
          ⚙️ Settings
        </Text>
      </View>

      <View style={{ paddingVertical: spacing.lg }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.text.secondary,
            paddingHorizontal: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          PREFERENCES
        </Text>

        <SettingItem
          icon="🌍"
          label="Language"
          value={language === 'en' ? 'English' : 'Português'}
          onPress={() => handleLanguageChange(language === 'en' ? 'pt' : 'en')}
        />

        <SettingItem
          icon="🔔"
          label="Notifications"
          hasToggle
          toggleValue={notificationsEnabled}
          onToggle={setNotificationsEnabled}
        />

        <SettingItem
          icon="🌙"
          label="Dark Mode"
          hasToggle
          toggleValue={darkMode}
          onToggle={setDarkMode}
        />

        <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: spacing.md,
              backgroundColor: colors.background.secondary,
            }}
          >
            <TouchableOpacity
              onPress={() => handleLanguageChange('en')}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                borderRadius: spacing.md,
                backgroundColor: language === 'en' ? colors.primary[700] : colors.neutral[200],
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: language === 'en' ? 'white' : colors.text.primary,
                  fontWeight: '600',
                }}
              >
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLanguageChange('pt')}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                borderRadius: spacing.md,
                backgroundColor: language === 'pt' ? colors.primary[700] : colors.neutral[200],
                marginLeft: spacing.sm,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: language === 'pt' ? 'white' : colors.text.primary,
                  fontWeight: '600',
                }}
              >
                PT
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.text.secondary,
            paddingHorizontal: spacing.lg,
            marginTop: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          ABOUT
        </Text>

        <SettingItem
          icon="ℹ️"
          label="About Babado.ai"
          value="Version 1.0.0"
          onPress={() => showInfo('About Babado.ai', 'The ultimate storytelling app powered by AI. Create, rewrite, and share viral stories across social media!')}
        />

        <SettingItem
          icon="📋"
          label="Privacy Policy"
          onPress={() => showInfo('Privacy Policy', 'Your privacy is our priority. We only use your data to improve your storytelling experience. No information is sold to third parties.')}
        />

        <SettingItem
          icon="⚖️"
          label="Terms of Service"
          onPress={() => showInfo('Terms of Service', 'By using Babado.ai, you agree to create respectful content and follow social media platform guidelines.')}
        />
      </View>
    </ScrollView>
  );
}
