import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }
    updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(form.name)}</Text>
            </View>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          {/* Fields */}
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', icon: 'person-outline', editable: true },
            { key: 'email', label: 'Email Address', placeholder: 'Email (cannot be changed)', icon: 'mail-outline', editable: false },
            { key: 'phone', label: 'Phone Number', placeholder: 'Enter phone number', icon: 'call-outline', editable: true, keyboard: 'phone-pad' },
            { key: 'address', label: 'Address', placeholder: 'Enter your address', icon: 'location-outline', editable: true },
          ].map(field => (
            <View style={styles.inputGroup} key={field.key}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={[styles.inputBox, !field.editable && styles.inputBoxDisabled]}>
                <Ionicons name={field.icon} size={18} color={field.editable ? '#999' : '#ccc'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, !field.editable && styles.inputDisabled]}
                  placeholder={field.placeholder}
                  placeholderTextColor="#bbb"
                  value={form[field.key]}
                  onChangeText={val => field.editable && update(field.key, val)}
                  editable={field.editable}
                  keyboardType={field.keyboard || 'default'}
                />
                {!field.editable && <Ionicons name="lock-closed" size={14} color="#ccc" />}
              </View>
            </View>
          ))}

          <View style={styles.memberInfo}>
            <Ionicons name="information-circle-outline" size={16} color="#1B8A4C" />
            <Text style={styles.memberInfoText}>Member since {user?.memberSince} • {user?.memberId}</Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  saveText: { color: '#1B8A4C', fontWeight: '700', fontSize: 15 },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1B8A4C', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { color: '#fff', fontSize: 30, fontWeight: '800' },
  avatarHint: { color: '#999', fontSize: 12 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 7 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, backgroundColor: '#fff' },
  inputBoxDisabled: { backgroundColor: '#F5F5F5', borderColor: '#EEE' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#222' },
  inputDisabled: { color: '#bbb' },
  memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', padding: 12, borderRadius: 10, marginBottom: 20 },
  memberInfoText: { color: '#1B8A4C', fontSize: 12, fontWeight: '500' },
  saveBtn: { backgroundColor: '#1B8A4C', paddingVertical: 15, borderRadius: 13, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
