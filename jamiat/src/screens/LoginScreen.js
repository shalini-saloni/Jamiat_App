import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      login({
        name,
        email: email.trim().toLowerCase(),
        memberSince: 2023,
        memberId: 'JU#-' + Math.floor(1000 + Math.random() * 9000),
        phone: '',
        address: '',
      });
    }, 900);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <LinearGradient colors={['#1B8A4C', '#0D5C30']} style={[styles.topSection, { paddingTop: insets.top + 24 }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>J</Text>
        </View>
        <Text style={styles.appName}>Jamiat</Text>
        <Text style={styles.tagline}>Give with purpose, impact with love</Text>
      </LinearGradient>

      <ScrollView style={styles.formSection} contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey of giving</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#aaa" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupBtnText}>Create New Account</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>By signing in, you agree to our Terms of Service and Privacy Policy</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topSection: { paddingHorizontal: 24, paddingBottom: 32, alignItems: 'center' },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  logoLetter: { color: '#fff', fontSize: 36, fontWeight: '800' },
  appName: { color: '#fff', fontSize: 30, fontWeight: '800', marginBottom: 4 },
  tagline: { color: 'rgba(255,255,255,0.75)', fontSize: 13, textAlign: 'center' },
  formSection: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 4, marginTop: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 24, lineHeight: 18 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 7 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, backgroundColor: '#FAFAFA' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#222' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 22 },
  forgotText: { color: '#1B8A4C', fontSize: 13, fontWeight: '600' },
  loginBtn: { backgroundColor: '#1B8A4C', paddingVertical: 15, borderRadius: 13, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EEE' },
  dividerText: { marginHorizontal: 14, color: '#aaa', fontSize: 13 },
  signupBtn: { borderWidth: 2, borderColor: '#1B8A4C', paddingVertical: 14, borderRadius: 13, alignItems: 'center' },
  signupBtnText: { color: '#1B8A4C', fontSize: 16, fontWeight: '700' },
  terms: { textAlign: 'center', color: '#bbb', fontSize: 11, marginTop: 20, lineHeight: 16 },
});
