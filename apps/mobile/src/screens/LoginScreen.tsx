import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { GraduationCap, ArrowRight, Chrome } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
      // In a real app, you'd update an Auth Context to trigger navigation
      // For now, we'll just navigate if the stack allows it
      navigation.navigate('Main');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'ログインに失敗しました');
    },
  });

  const isLoading = loginMutation.isPending;

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIconBg}>
              <GraduationCap size={40} color="#fff" />
            </View>
            <Text style={styles.logoText}>Eigo Master</Text>
            <Text style={styles.logoSubtitle}>英語マスターへの第一歩</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>ログイン</Text>
            <Text style={styles.subtitle}>メールアドレスとパスワードを入力してください</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>メールアドレス</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.row}>
                <Text style={styles.label}>パスワード</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>パスワードを忘れた場合</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                disabled={isLoading}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>{isLoading ? 'ログイン中...' : 'ログイン'}</Text>
              {!isLoading && <ArrowRight size={20} color="#fff" style={styles.buttonIcon} />}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>または他でログイン</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Chrome size={20} color="#64748b" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.lineIconBg}>
                  <Text style={styles.lineIconText}>L</Text>
                </View>
                <Text style={styles.socialButtonText}>LINE</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>アカウントをお持ちではありませんか？</Text>
            <TouchableOpacity>
              <Text style={styles.signupText}>新しくアカウントを作成する (無料)</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            ログインすることで、当社の{' '}
            <Text style={styles.linkText}>利用規約</Text> および{' '}
            <Text style={styles.linkText}>プライバシーポリシー</Text> に同意したものとみなされます。
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIconBg: {
    width: 80,
    height: 80,
    backgroundColor: '#6366f1',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e1b4b',
    marginTop: 16,
  },
  logoSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#6366f1',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    paddingHorizontal: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 12,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  lineIconBg: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00B900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineIconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  signupText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#6366f1',
    marginTop: 4,
  },
  termsText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 40,
    lineHeight: 18,
    fontWeight: '600',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default LoginScreen;
