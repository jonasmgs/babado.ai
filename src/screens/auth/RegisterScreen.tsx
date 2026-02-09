import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
}

export default function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    clearError();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await register(email, password, username);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: colors.background.primary }}
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: colors.primary[700],
              marginBottom: spacing.xl,
              textAlign: 'center',
            }}
          >
            {t('auth.createAccount')}
          </Text>

          {error && (
            <View
              style={{
                backgroundColor: colors.status.error + '20',
                borderRadius: spacing.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
                borderLeftWidth: 4,
                borderLeftColor: colors.status.error,
              }}
            >
              <Text style={{ color: colors.status.error, fontSize: 14 }}>{error}</Text>
            </View>
          )}

          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              {t('auth.username')}
            </Text>
            <TextInput
              placeholder="your_username"
              value={username}
              onChangeText={setUsername}
              editable={!isLoading}
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: spacing.md,
                padding: spacing.md,
                fontSize: 16,
                color: colors.text.primary,
              }}
            />
          </View>

          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              {t('auth.email')}
            </Text>
            <TextInput
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: spacing.md,
                padding: spacing.md,
                fontSize: 16,
                color: colors.text.primary,
              }}
            />
          </View>

          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              {t('auth.password')}
            </Text>
            <TextInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: spacing.md,
                padding: spacing.md,
                fontSize: 16,
                color: colors.text.primary,
              }}
            />
          </View>

          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              Confirm Password
            </Text>
            <TextInput
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: spacing.md,
                padding: spacing.md,
                fontSize: 16,
                color: colors.text.primary,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={{
              backgroundColor: colors.primary[700],
              borderRadius: spacing.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {t('auth.register')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onNavigate('Login')}>
            <Text style={{ textAlign: 'center', color: colors.primary[600] }}>
              {t('auth.alreadyHaveAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
