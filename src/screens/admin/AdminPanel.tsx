import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { colors, spacing } from '@/constants/colors';

interface AdminPanelProps {
  onNavigate: (screen: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStories: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentStories, setRecentStories] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setIsLoading(true);
    try {
      const [usersRes, storiesRes] = await Promise.all([
        supabase.from('users').select('count', { count: 'exact' }),
        supabase.from('stories').select('count', { count: 'exact' }),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalStories: storiesRes.count || 0,
        monthlyRevenue: 0,
        activeSubscriptions: 0,
      });

      const { data: stories } = await supabase
        .from('stories')
        .select('*')
        .limit(10)
        .order('createdAt', { ascending: false });

      setRecentStories(stories || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
    <View
      style={{
        backgroundColor: colors.background.primary,
        borderRadius: spacing.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <Text style={{ fontSize: 24, marginRight: spacing.md }}>{icon}</Text>
        <Text style={{ fontSize: 14, color: colors.text.secondary }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.primary[700] }}>
        {value}
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
        Admin Dashboard
      </Text>

      <StatCard icon="👥" label="Total Users" value={stats.totalUsers} />
      <StatCard icon="📚" label="Total Stories" value={stats.totalStories} />
      <StatCard icon="💰" label="Monthly Revenue" value={`$${stats.monthlyRevenue}`} />
      <StatCard icon="✓" label="Active Subscriptions" value={stats.activeSubscriptions} />

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginTop: spacing.lg,
          marginBottom: spacing.md,
        }}
      >
        Recent Stories
      </Text>

      {recentStories.length === 0 ? (
        <Text style={{ color: colors.text.secondary, textAlign: 'center', paddingVertical: spacing.lg }}>
          No stories yet
        </Text>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={recentStories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: colors.background.primary,
                borderRadius: spacing.md,
                padding: spacing.md,
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: colors.neutral[200],
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                Status: {item.status}
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}
