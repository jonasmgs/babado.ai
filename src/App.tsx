import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/services/supabase';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import StoryEditorScreen from '@/screens/story/StoryEditorScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SubscriptionScreen from '@/screens/subscription/SubscriptionScreen';
import AnalyticsScreen from '@/screens/analytics/AnalyticsScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import AdminPanel from '@/screens/admin/AdminPanel';
import VoiceScreen from '@/screens/voice/VoiceScreen';
import VideoEditorScreen from '@/screens/video/VideoEditorScreen';
import SocialMediaScreen from '@/screens/social/SocialMediaScreen';
import TrendsScreen from '@/screens/trends/TrendsScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import { colors } from '@/constants/colors';

type Screen = 'Login' | 'Register' | 'Home' | 'StoryEditor' | 'StoryDetail' | 'Profile' | 'Subscription' | 'Analytics' | 'Notifications' | 'Settings' | 'Payment' | 'Admin' | 'Voice' | 'VideoEditor' | 'Trends' | 'Social' | 'Onboarding';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Onboarding');
  const [isInitializing, setIsInitializing] = useState(true);
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    // Add a safety timeout to prevent hanging initialization on web
    const timer = setTimeout(() => {
      if (isInitializing) {
        console.warn('Initialization timed out, defaulting to Login');
        setIsInitializing(false);
        setCurrentScreen('Login');
      }
    }, 5000);

    checkAuth();
    return () => clearTimeout(timer);
  }, []);

  const checkAuth = async () => {
    console.log('[DEBUG] Starting checkAuth...');
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log('[DEBUG] Session retrieved:', !!session);

      if (session) {
        await fetchUser();
        console.log('[DEBUG] User fetched, navigating to Home');
        setCurrentScreen('Home');
      } else {
        console.log('[DEBUG] No session, navigating to Onboarding');
        setCurrentScreen('Onboarding');
      }
    } catch (error) {
      console.error('[DEBUG] Auth check error:', error);
      setCurrentScreen('Login');
    } finally {
      console.log('[DEBUG] checkAuth finished, setting isInitializing to false');
      setIsInitializing(false);
    }
  };

  const handleNavigate = (screen: Screen) => {
    console.log('[DEBUG] Navigating to:', screen);
    setCurrentScreen(screen);
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary, padding: 20 }}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
        {Platform.OS === 'web' && (
          <>
            <Text style={{ marginTop: 20, color: colors.text.secondary }}>
              Initializing Babado.ai...
            </Text>
            <TouchableOpacity 
              onPress={() => {
                console.warn('Manual override triggered');
                setIsInitializing(false);
                setCurrentScreen('Onboarding');
              }}
              style={{ marginTop: 40, padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
            >
              <Text style={{ color: colors.primary[500] }}>Bypass Initialization (Debug)</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  useNotifications();

  const nav = (screen: string) => handleNavigate(screen as Screen);

  switch (currentScreen) {
    case 'Login':
      return <LoginScreen onNavigate={nav} />;
    case 'Register':
      return <RegisterScreen onNavigate={nav} />;
    case 'Home':
      return <HomeScreen onNavigate={nav} />;
    case 'StoryEditor':
      return <StoryEditorScreen onNavigate={nav} />;
    case 'Profile':
      return <ProfileScreen onNavigate={nav} />;
    case 'Subscription':
      return <SubscriptionScreen onNavigate={nav} />;
    case 'Analytics':
      return <AnalyticsScreen onNavigate={nav} />;
    case 'Notifications':
      return <NotificationsScreen onNavigate={nav} />;
    case 'Settings':
      return <SettingsScreen onNavigate={nav} />;
    case 'Admin':
      return <AdminPanel onNavigate={nav} />;
    case 'Voice':
      return <VoiceScreen onNavigate={nav} storyId="temp-id" storyContent="Example story content for voice generation testing..." />;
    case 'VideoEditor':
      return <VideoEditorScreen onNavigate={nav} storyContent="Example story content for video generation testing..." />;
    case 'Social':
      return <SocialMediaScreen onNavigate={nav} storyId="temp-id" />;
    case 'Trends':
      return <TrendsScreen onNavigate={nav} />;
    case 'Onboarding':
      return <OnboardingScreen onComplete={() => setCurrentScreen('Login')} />;
    default:
      return <HomeScreen onNavigate={nav} />;
  }
}
