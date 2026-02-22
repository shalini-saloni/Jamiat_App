import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export default function SignupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signup } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSignup = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (!form.email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: '',
        memberSince: new Date().getFullYear(),
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#1B8A4C', '#0D5C30']} style={[styles.topBg, { paddingTop: insets.top }]}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>J</Text>
            </View>
            <Text style={styles.appName}>Create Account</Text>
            <Text style={styles.tagline}>Join thousands of generous donors</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.form} contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        {[
          { key: 'name', label: 'Full Name *', placeholder: 'Enter your full name', icon: 'person-outline', type: 'default' },
          { key: 'email', label: 'Email Address *', placeholder: 'Enter your email', icon: 'mail-outline', type: 'email-address' },
          { key: 'phone', label: 'Phone Number', placeholder: 'Enter your phone (optional)', icon: 'call-outline', type: 'phone-pad' },
        ].map(field => (
          <View style={styles.inputGroup} key={field.key}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={styles.inputBox}>
              <Ionicons name={field.icon} size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#bbb"
                keyboardType={field.type}
                autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                value={form[field.key]}
                onChangeText={val => update(field.key, val)}
              />
            </View>
          </View>
        ))}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPass}
              value={form.password}
              onChangeText={val => update('password', val)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPass}
              value={form.confirmPassword}
              onChangeText={val => update('confirmPassword', val)}
            />
          </View>
        </View>

        <TouchableOpacity style={[styles.signupBtn, loading && { opacity: 0.7 }]} onPress={handleSignup} disabled={loading}>
          <Text style={styles.signupBtnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: '#1B8A4C', fontWeight: '700' }}>Sign In</Text></Text>
        </TouchableOpacity>

        <Text style={styles.terms}>By creating an account, you agree to our Terms of Service and Privacy Policy</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBg: { paddingBottom: 20 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  logoArea: { flex: 1, alignItems: 'center' },
  logoCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  logoText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  appName: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 2 },
  tagline: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  form: { flex: 1, backgroundColor: '#fff' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#FAFAFA' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#222' },
  signupBtn: { backgroundColor: '#1B8A4C', paddingVertical: 15, borderRadius: 13, alignItems: 'center', marginTop: 6, shadowColor: '#1B8A4C', shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  signupBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 16 },
  loginLinkText: { color: '#888', fontSize: 14 },
  terms: { textAlign: 'center', color: '#bbb', fontSize: 11, marginTop: 16, lineHeight: 16 },
});
