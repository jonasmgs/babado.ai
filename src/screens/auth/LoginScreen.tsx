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
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { t } from '@/i18n';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    clearError();
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Abstract Background Design */}
        <View style={styles.headerAccent} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="flash" size={32} color={colors.primary.neon} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your viral journey</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('auth.email')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  placeholder="you@example.com"
                  placeholderTextColor={colors.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={[styles.inputWrapper, { marginBottom: spacing.xl }]}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={colors.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                  style={styles.input}
                />
              </View>
              <TouchableOpacity style={styles.forgotPass}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.registerLink}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => onNavigate('Register')}>
                <Text style={styles.registerAction}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerAccent: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary[700],
    opacity: 0.1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    paddingTop: 80,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary[800],
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: colors.status.error,
    fontSize: 14,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotText: {
    color: colors.primary.neon,
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  registerText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  registerAction: {
    color: colors.primary.neon,
    fontSize: 14,
    fontWeight: '700',
  },
});
