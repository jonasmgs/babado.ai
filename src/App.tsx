import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/services/supabase';

// Screens
import AdminPanel from '@/screens/admin/AdminPanel';
import AnalyticsScreen from '@/screens/analytics/AnalyticsScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import SocialMediaScreen from '@/screens/social/SocialMediaScreen';
import StoryEditorScreen from '@/screens/story/StoryEditorScreen';
import SubscriptionScreen from '@/screens/subscription/SubscriptionScreen';
import TrendsScreen from '@/screens/trends/TrendsScreen';
import VideoEditorScreen from '@/screens/video/VideoEditorScreen';
import VoiceScreen from '@/screens/voice/VoiceScreen';

import { colors } from '@/constants/colors';

type Screen = 
  | 'Onboarding' | 'Login' | 'Register' | 'Home' | 'Admin' 
  | 'Analytics' | 'Notifications' | 'Profile' | 'Settings' 
  | 'Social' | 'StoryEditor' | 'Subscription' | 'Trends' 
  | 'VideoEditor' | 'Voice';

// Error Boundary for stability
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("APP CRASH:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 30, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ff4444', fontSize: 24, fontWeight: 'bold' }}>Ops! Ocorreu um erro.</Text>
          <Text style={{ color: '#fff', marginTop: 20, textAlign: 'center', opacity: 0.8 }}>{this.state.error?.toString()}</Text>
          <Text style={{ color: '#888', marginTop: 40, fontSize: 12 }}>Tente atualizar a página ou verifique o console.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Onboarding');
  const [isInitializing, setIsInitializing] = useState(true);
  const [navigationData, setNavigationData] = useState<any>({});
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      console.log('[Auth] Starting initialization...');
      
      // Safety timeout - hide loader after 5 seconds no matter what
      const timer = setTimeout(() => {
        if (mounted) {
          console.warn('[Auth] Initialization timeout reached');
          setIsInitializing(false);
        }
      }, 5000);

      try {
        // 1. Check current session explicitly
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session) {
          console.log('[Auth] Session found on init');
          await fetchUser();
          setCurrentScreen('Home');
        } else {
          console.log('[Auth] No session found on init');
          setCurrentScreen('Onboarding');
        }
      } catch (err) {
        console.error('[Auth] Init Error:', err);
        setCurrentScreen('Login');
      } finally {
        if (mounted) {
          clearTimeout(timer);
          setIsInitializing(false);
        }
      }

      // 2. Set up listener for future changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`[Auth] Event Change: ${event}`, session?.user?.id);
        if (event === 'SIGNED_IN' && session) {
          await fetchUser();
          setCurrentScreen('Home');
        } else if (event === 'SIGNED_OUT') {
          setCurrentScreen('Login');
        }
      });

      return subscription;
    }

    const authPromise = initializeAuth();

    return () => {
      mounted = false;
      authPromise.then(sub => sub?.unsubscribe());
    };
  }, [fetchUser]);

  // Hook for notifications
  useNotifications();

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
        <Text style={{ marginTop: 20, color: colors.text.secondary }}>Carregando Babado.ai...</Text>
      </View>
    );
  }

  const navigate = (screen: string, data?: any) => {
    console.log(`[Nav] Navigating to ${screen}`, data);
    setCurrentScreen(screen as Screen);
    if (data) setNavigationData(data);
  };

  const renderScreen = () => {
    const nav = (s: string) => navigate(s);

    switch (currentScreen) {
      case 'Onboarding': return <OnboardingScreen onComplete={() => setCurrentScreen('Login')} />;
      case 'Login': return <LoginScreen onNavigate={nav} />;
      case 'Register': return <RegisterScreen onNavigate={nav} />;
      case 'Home': return <HomeScreen onNavigate={nav} />;
      case 'Admin': return <AdminPanel onNavigate={nav} />;
      case 'Analytics': return <AnalyticsScreen onNavigate={nav} />;
      case 'Notifications': return <NotificationsScreen onNavigate={nav} />;
      case 'Profile': return <ProfileScreen onNavigate={nav} />;
      case 'Settings': return <SettingsScreen onNavigate={nav} />;
      case 'Social': return <SocialMediaScreen onNavigate={nav} storyId={navigationData.storyId} />;
      case 'StoryEditor': return <StoryEditorScreen onNavigate={nav} />;
      case 'Subscription': return <SubscriptionScreen onNavigate={nav} />;
      case 'Trends': return <TrendsScreen onNavigate={nav} />;
      case 'VideoEditor': return <VideoEditorScreen onNavigate={nav} storyContent={navigationData.storyContent || "Exemplo de conteúdo"} />;
      case 'Voice': return <VoiceScreen onNavigate={nav} storyId={navigationData.storyId || "temp"} storyContent={navigationData.storyContent || "Conteúdo para voz"} />;
      default: return <HomeScreen onNavigate={nav} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <View style={{ position: 'absolute', bottom: 5, right: 5, pointerEvents: 'none' }}>
        <Text style={{ fontSize: 9, color: 'rgba(0,0,0,0.2)' }}>v1.0.2</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
