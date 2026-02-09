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
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface SubscriptionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
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
    onNavigate('Payment', { planId });
  };

  const PlanCard = ({ plan }: any) => (
    <View style={[styles.planCard, plan.popular && styles.popularCard]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <Text style={styles.planName}>{plan.name}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.currency}>$</Text>
        <Text style={styles.priceValue}>{plan.price}</Text>
        <Text style={styles.perMonth}>/mo</Text>
      </View>

      <View style={styles.featuresList}>
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color={plan.popular ? colors.primary.neon : colors.status.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => handleSubscribe(plan.id)}
        style={[
          styles.subscribeBtn,
          plan.popular ? styles.popularBtn : styles.standardBtn
        ]}
      >
        <Text style={[
          styles.subscribeBtnText,
          plan.popular ? styles.popularBtnText : styles.standardBtnText
        ]}>
          {plan.id === 'free' ? 'Current Plan' : t('payment.subscribe')}
        </Text>
      </TouchableOpacity>
    </View>
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
          <Text style={styles.headerTitle}>Upgrade</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>Unlock Full Magic</Text>
          <Text style={styles.subtitle}>Escolha o plano perfeito para sua jornada de criador.</Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
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
    paddingBottom: spacing.lg,
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
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
  },
  intro: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  plansContainer: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  planCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 30,
    padding: 24,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  popularCard: {
    borderColor: colors.primary.neon + '60',
    backgroundColor: colors.primary[700] + '15',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.primary.neon,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    color: 'black',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.tertiary,
    marginRight: 2,
  },
  priceValue: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text.primary,
  },
  perMonth: {
    fontSize: 16,
    color: colors.text.tertiary,
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text.secondary,
    marginLeft: 12,
  },
  subscribeBtn: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularBtn: {
    backgroundColor: colors.primary.neon,
    shadowColor: colors.primary.neon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  standardBtn: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  subscribeBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  popularBtnText: {
    color: 'black',
  },
  standardBtnText: {
    color: colors.text.primary,
  },
});
