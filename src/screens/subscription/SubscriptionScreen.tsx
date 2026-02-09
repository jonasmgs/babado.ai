import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';

interface SubscriptionScreenProps {
  onNavigate: (screen: string) => void;
}

const plans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '0',
    storiesPerMonth: 5,
    exportsPerMonth: 10,
    aiVoice: false,
    multiformatExport: false,
    features: ['5 stories/month', '10 exports/month', 'Basic AI rewrite'],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '9.99',
    storiesPerMonth: 50,
    exportsPerMonth: 100,
    aiVoice: true,
    multiformatExport: true,
    features: ['50 stories/month', '100 exports/month', 'AI voice narration', 'Multi-format export'],
    popular: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited Plan',
    price: '19.99',
    storiesPerMonth: 999,
    exportsPerMonth: 999,
    aiVoice: true,
    multiformatExport: true,
    features: ['Unlimited stories', 'Unlimited exports', 'Premium AI voices', 'Priority support', 'Advanced analytics'],
  },
];

export default function SubscriptionScreen({ onNavigate }: SubscriptionScreenProps) {
  const handleSubscribe = (planId: string) => {
    onNavigate('Payment');
  };

  const PlanCard = ({ plan }: any) => (
    <View
      style={{
        backgroundColor: colors.background.primary,
        borderRadius: spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 2,
        borderColor: plan.popular ? colors.primary[600] : colors.neutral[200],
        position: 'relative',
      }}
    >
      {plan.popular && (
        <View
          style={{
            position: 'absolute',
            top: -12,
            left: spacing.lg,
            backgroundColor: colors.primary[600],
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: spacing.md,
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>Most Popular</Text>
        </View>
      )}

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: spacing.sm,
          marginTop: plan.popular ? spacing.md : 0,
        }}
      >
        {plan.name}
      </Text>

      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.primary[700] }}>
          ${plan.price}
        </Text>
        <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: spacing.sm }}>
          {t('payment.perMonth')}
        </Text>
      </View>

      <View style={{ marginBottom: spacing.lg }}>
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ fontSize: 16, marginRight: spacing.md, color: colors.status.success }}>✓</Text>
            <Text style={{ fontSize: 14, color: colors.text.secondary, flex: 1 }}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => handleSubscribe(plan.id)}
        style={{
          backgroundColor: plan.popular ? colors.primary[700] : colors.neutral[200],
          borderRadius: spacing.md,
          paddingVertical: spacing.md,
        }}
      >
        <Text
          style={{
            color: plan.popular ? 'white' : colors.text.primary,
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {plan.id === 'free' ? 'Current Plan' : t('payment.subscribe')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background.secondary }}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          backgroundColor: colors.background.primary,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral[200],
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          {t('payment.upgrade')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.text.secondary }}>
          Choose the perfect plan for your storytelling journey
        </Text>
      </View>

      <View style={{ paddingVertical: spacing.lg }}>
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </View>
    </ScrollView>
  );
}
