import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/services/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

import { Platform } from 'react-native';

export function useNotifications() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      registerForPushNotifications();
    }
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').update({ push_token: token }).eq('id', user.id);
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  const sendNotification = async (title: string, message: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        sound: true,
      },
      trigger: { seconds: 1 },
    });
  };

  return { sendNotification };
}
