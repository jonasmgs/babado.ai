import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { colors, spacing } from '@/constants/colors';
import { Notification } from '@/types';

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void;
}

export default function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', user?.id)
        .order('createdAt', { ascending: false });

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'story_published':
        return '📝';
      case 'milestone':
        return '🏆';
      case 'payment':
        return '💳';
      default:
        return '📢';
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <TouchableOpacity
      onPress={() => markAsRead(notification.id)}
      style={{
        backgroundColor: notification.read ? colors.background.primary : colors.primary[50],
        borderRadius: spacing.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: notification.read ? colors.neutral[300] : colors.primary[600],
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 24, marginRight: spacing.md }}>
          {getNotificationIcon(notification.type)}
        </Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            {notification.title}
          </Text>
          <Text style={{ fontSize: 13, color: colors.text.secondary, marginBottom: spacing.sm }}>
            {notification.message}
          </Text>
          <Text style={{ fontSize: 11, color: colors.text.tertiary }}>
            {new Date(notification.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {!notification.read && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.primary[600],
              marginTop: spacing.sm,
              marginLeft: spacing.md,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xl }}>
      <Text style={{ fontSize: 18, color: colors.text.secondary, marginBottom: spacing.md }}>
        No notifications yet
      </Text>
      <Text style={{ fontSize: 14, color: colors.text.tertiary, textAlign: 'center' }}>
        You'll see updates about your stories and activities here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.secondary }}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: spacing.lg,
        }}
      >
        🔔 Notifications
      </Text>

      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          scrollEnabled={false}
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem notification={item} />}
        />
      )}
    </ScrollView>
  );
}
