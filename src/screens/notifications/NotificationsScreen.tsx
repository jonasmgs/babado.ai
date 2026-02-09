import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, spacing } from '@/constants/colors';
import { Notification } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface NotificationsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', user?.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case 'story_published':
        return { icon: 'document-text', color: '#25F4EE' };
      case 'milestone':
        return { icon: 'trophy', color: '#fbbf24' };
      case 'payment':
        return { icon: 'card', color: '#10b981' };
      default:
        return { icon: 'notifications', color: '#FE2C55' };
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const config = getNotificationConfig(notification.type);
    return (
      <TouchableOpacity
        onPress={() => markAsRead(notification.id)}
        style={[
          styles.notiItem,
          notification.read ? styles.notiRead : styles.notiUnread
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: config.color + '15' }]}>
          <Ionicons name={config.icon as any} size={22} color={config.color} />
        </View>
        <View style={styles.notiContent}>
          <Text style={styles.notiTitle}>{notification.title}</Text>
          <Text style={styles.notiMessage}>{notification.message}</Text>
          <Text style={styles.notiTime}>
            {new Date(notification.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
          </Text>
        </View>
        {!notification.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>{t('dashboard.notifications')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#25F4EE" />
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.centerContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="notifications-off-outline" size={40} color={colors.text.tertiary} />
              </View>
              <Text style={styles.emptyTitle}>{language === 'pt' ? 'Silêncio por aqui...' : 'All quiet here...'}</Text>
              <Text style={styles.emptySubtitle}>
                {language === 'pt' ? 'Suas atualizações mágicas aparecerão aqui em breve.' : 'Your magic updates will appear here soon.'}
              </Text>
            </View>
          ) : (
            notifications.map(item => (
              <NotificationItem key={item.id} notification={item} />
            ))
          )}
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
  content: {
    paddingHorizontal: spacing.xl,
  },
  notiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: spacing.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  notiUnread: {
    borderColor: '#25F4EE40',
    backgroundColor: 'rgba(37, 244, 238, 0.05)',
  },
  notiRead: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notiContent: {
    flex: 1,
  },
  notiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  notiMessage: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  notiTime: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FE2C55',
    marginLeft: 10,
  },
  centerContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
