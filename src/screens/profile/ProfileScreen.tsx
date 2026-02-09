import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onNavigate('Login');
  };

  const MenuItem = ({ icon, label, onPress, color = colors.text.secondary }: { icon: string; label: string; onPress: () => void; color?: string }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.menuItem}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
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
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            onPress={() => onNavigate('Settings')}
            style={styles.settingsBtn}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.userSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGradient}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>12</Text>
              <Text style={styles.miniStatLabel}>Stories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>Pro</Text>
              <Text style={styles.miniStatLabel}>Status</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>980</Text>
              <Text style={styles.miniStatLabel}>Points</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Content Management</Text>
          <MenuItem
            icon="document-text-outline"
            label="My Stories"
            color={colors.primary.neon}
            onPress={() => onNavigate('Home')}
          />
          <MenuItem
            icon="bar-chart-outline"
            label={t('dashboard.analytics')}
            color="#ec4899"
            onPress={() => onNavigate('Analytics')}
          />
          <MenuItem
            icon="diamond-outline"
            label={t('dashboard.subscription')}
            color="#fbbf24"
            onPress={() => onNavigate('Subscription')}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem
            icon="notifications-outline"
            label={t('dashboard.notifications')}
            color="#6366f1"
            onPress={() => onNavigate('Notifications')}
          />
          <MenuItem
            icon="settings-outline"
            label={t('common.settings')}
            color="#64748b"
            onPress={() => onNavigate('Settings')}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={20} color="#f43f5e" />
          <Text style={styles.logoutBtnText}>{t('common.logout')}</Text>
        </TouchableOpacity>
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
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 35,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary.neon,
    shadowColor: colors.primary.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  statusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  username: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  miniStat: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  miniStatLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.background.glassBorder,
  },
  menuSection: {
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 14,
    borderRadius: 20,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    marginHorizontal: spacing.xl,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#f43f5e15',
    borderWidth: 1,
    borderColor: '#f43f5e40',
  },
  logoutBtnText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#f43f5e',
  },
});
