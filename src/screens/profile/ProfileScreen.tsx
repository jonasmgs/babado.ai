import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onNavigate('Login');
  };

  const MenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
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
      </View>
      <Text style={{ fontSize: 18, color: colors.text.tertiary }}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xl,
          backgroundColor: colors.primary[50],
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
        <View style={{ flex: 1 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary[200],
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.xs,
            }}
          >
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text.primary, marginBottom: spacing.sm }}>
            {user?.username || 'User'}
          </Text>
          <Text style={{ fontSize: 14, color: colors.text.secondary }}>{user?.email}</Text>
        </View>
      </View>

      <View style={{ paddingVertical: spacing.lg }}>
        <MenuItem
          icon="📊"
          label="My Stories"
          onPress={() => onNavigate('Home')}
        />
        <MenuItem
          icon="📈"
          label={t('dashboard.analytics')}
          onPress={() => onNavigate('Analytics')}
        />
        <MenuItem
          icon="💳"
          label={t('dashboard.subscription')}
          onPress={() => onNavigate('Subscription')}
        />
        <MenuItem
          icon="🔔"
          label={t('dashboard.notifications')}
          onPress={() => onNavigate('Notifications')}
        />
        <MenuItem
          icon="⚙️"
          label={t('common.settings')}
          onPress={() => onNavigate('Settings')}
        />
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: colors.status.error + '20',
            borderRadius: spacing.md,
            paddingVertical: spacing.md,
          }}
        >
          <Text
            style={{
              color: colors.status.error,
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {t('common.logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
