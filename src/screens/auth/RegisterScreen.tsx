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
import { useTranslation } from '@/hooks/useTranslation';
import { colors, spacing } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface RegisterScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const { t, language } = useTranslation();

  const handleRegister = async () => {
    clearError();
    if (password !== confirmPassword) {
      alert(language === 'pt' ? 'As senhas não coincidem' : 'Passwords do not match');
      return;
    }
    await register(email, password, username);
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
        <View style={styles.headerAccent} />
        
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => onNavigate('Login')}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>{language === 'pt' ? 'Criar Conta' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>{language === 'pt' ? 'Junte-se a milhares de criadores hoje' : 'Join thousands of creators today'}</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('auth.username')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="at-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  placeholder="your_username"
                  placeholderTextColor={colors.text.tertiary}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  editable={!isLoading}
                  style={styles.input}
                />
              </View>
            </View>

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

            <View style={styles.inputWrapper}>
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
            </View>

            <View style={[styles.inputWrapper, { marginBottom: spacing.xl }]}>
              <Text style={styles.label}>{language === 'pt' ? 'Confirmar Senha' : 'Confirm Password'}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={colors.text.tertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!isLoading}
                  style={styles.input}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              style={[styles.registerBtn, isLoading && { opacity: 0.7 }]}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.registerBtnText}>{t('auth.register')}</Text>
                  <Ionicons name="sparkles" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.loginLink}>
              <Text style={styles.loginText}>{language === 'pt' ? 'Já tem uma conta?' : 'Already have an account?'} </Text>
              <TouchableOpacity onPress={() => onNavigate('Login')}>
                <Text style={styles.loginAction}>{language === 'pt' ? 'Entrar' : 'Sign In'}</Text>
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
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary[700],
    opacity: 0.05,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    paddingTop: 60,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
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
  registerBtn: {
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
  registerBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  loginText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  loginAction: {
    color: colors.primary.neon,
    fontSize: 14,
    fontWeight: '700',
  },
});
