import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface SettingsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { 
    language, 
    setLanguage, 
    darkMode, 
    setDarkMode, 
    notificationsEnabled, 
    setNotificationsEnabled 
  } = useSettingsStore();
  
  const { t } = useTranslation();

  const handleLanguageChange = (lang: 'en' | 'pt') => {
    setLanguage(lang);
    Alert.alert(
      lang === 'en' ? 'Language Updated' : 'Idioma Atualizado', 
      lang === 'en' ? 'Application language changed to English.' : 'O idioma do aplicativo foi alterado para Português.'
    );
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
    color = '#25F4EE', // TikTok Cyan
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
          trackColor={{ false: '#334155', true: '#FE2C5580' }} // TikTok Red semi-transparent
          thumbColor={toggleValue ? '#FE2C55' : '#94a3b8'} // TikTok Red
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
          <Text style={styles.headerTitle}>{t('dashboard.settings')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Preferences' : 'Preferências'}</Text>
          <SettingItem
            icon="language-outline"
            label={language === 'en' ? 'Language' : 'Idioma'}
            value={language === 'en' ? 'English' : 'Português'}
            onPress={() => handleLanguageChange(language === 'en' ? 'pt' : 'en')}
            color="#25F4EE" // TikTok Cyan
          />

          <SettingItem
            icon="notifications-outline"
            label={t('dashboard.notifications')}
            hasToggle
            toggleValue={notificationsEnabled}
            onToggle={setNotificationsEnabled}
            color="#FE2C55" // TikTok Red
          />

          <SettingItem
            icon="moon-outline"
            label={language === 'en' ? 'Dark Mode' : 'Modo Escuro'}
            hasToggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
            color="#A78BFA"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'About' : 'Sobre'}</Text>
          <SettingItem
            icon="information-circle-outline"
            label="About Babado.ai"
            value="Version 1.2.0 (TikTok Edition)"
            onPress={() => showInfo('About Babado.ai', 'The ultimate storytelling app. TikTok style!')}
            color="#64748b"
          />

          <SettingItem
            icon="shield-checkmark-outline"
            label={language === 'en' ? 'Privacy Policy' : 'Política de Privacidade'}
            onPress={() => showInfo('Privacy Policy', 'Your data is safe.')}
            color="#10b981"
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
