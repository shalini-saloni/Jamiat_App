import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const DONATION_ICONS = {
  moon: 'moon', heart: 'heart', star: 'star',
  water: 'water', school: 'school', medical: 'medical',
};

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, donations, totalImpact, logout } = useApp();

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const livesTouched = Math.floor(totalImpact / 200);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="create-outline" size={22} color="#1B8A4C" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <LinearGradient colors={['#1B8A4C', '#0D5C30']} style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          <Text style={styles.profileMeta}>Member since {user?.memberSince} • {user?.memberId}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={14} color="#fff" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>₹{totalImpact.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Donated</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{donations.length}</Text>
            <Text style={styles.statLabel}>Donations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{livesTouched > 0 ? `${livesTouched}+` : '0'}</Text>
            <Text style={styles.statLabel}>Lives Touched</Text>
          </View>
        </View>

        {/* Donation History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Donation History</Text>
            <TouchableOpacity onPress={() => navigation.navigate('OurImpact')}>
              <Text style={styles.seeAll}>View Impact ›</Text>
            </TouchableOpacity>
          </View>
          {donations.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🤲</Text>
              <Text style={styles.emptyText}>No donations yet</Text>
              <TouchableOpacity
                style={styles.donateNowBtn}
                onPress={() => navigation.navigate('Donation')}
              >
                <Text style={styles.donateNowText}>Make Your First Donation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            donations.slice(0, 5).map((d, i) => (
              <View key={d.id || i} style={[styles.donationRow, i === donations.slice(0, 5).length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.donationIconBox}>
                  <Ionicons name={DONATION_ICONS[d.icon] || 'heart'} size={18} color="#1B8A4C" />
                </View>
                <View style={styles.donationInfo}>
                  <Text style={styles.donationName} numberOfLines={1}>{d.name}</Text>
                  <Text style={styles.donationDate}>{d.date} • {d.type?.toUpperCase()}{d.recurring ? ' • 🔁' : ''}</Text>
                </View>
                <Text style={styles.donationAmount}>₹{d.amount?.toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>

        {/* 80G Tax */}
        {totalImpact > 0 && (
          <View style={styles.taxCard}>
            <View style={styles.taxIcon}>
              <Ionicons name="document-text" size={20} color="#1B8A4C" />
            </View>
            <View style={styles.taxInfo}>
              <Text style={styles.taxTitle}>Tax Savings (80G)</Text>
              <Text style={styles.taxDesc}>Download your FY tax-exempt certificate</Text>
            </View>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => Alert.alert('80G Receipt', `Your tax receipt will be emailed to ${user?.email}`)}
            >
              <Ionicons name="download-outline" size={14} color="#fff" />
              <Text style={styles.downloadText}>Get</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {[
            { icon: 'person-outline', label: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
            { icon: 'bar-chart-outline', label: 'Impact Dashboard', onPress: () => navigation.navigate('OurImpact') },
            { icon: 'notifications-outline', label: 'Notification Preferences', onPress: () => {} },
            { icon: 'lock-closed-outline', label: 'Security & App PIN', onPress: () => {} },
            { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.settingRow, i === 4 && { borderBottomWidth: 0 }]} onPress={item.onPress}>
              <View style={styles.settingIconBox}>
                <Ionicons name={item.icon} size={18} color="#555" />
              </View>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#E53935" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Jamiat App v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  profileCard: { margin: 16, borderRadius: 20, padding: 20, alignItems: 'center' },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FF9800', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 28 },
  profileName: { color: '#fff', fontWeight: '800', fontSize: 20, marginBottom: 4 },
  profileEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 4 },
  profileMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 14 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  editBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  statsCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  statLabel: { fontSize: 10, color: '#999', fontWeight: '500', textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: '#EEE', marginHorizontal: 8 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  seeAll: { color: '#1B8A4C', fontSize: 13, fontWeight: '600' },
  emptyBox: { alignItems: 'center', paddingVertical: 20 },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#999', marginBottom: 14 },
  donateNowBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  donateNowText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  donationRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  donationIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  donationInfo: { flex: 1 },
  donationName: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  donationDate: { fontSize: 11, color: '#999' },
  donationAmount: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  taxCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 14, gap: 12 },
  taxIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  taxInfo: { flex: 1 },
  taxTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  taxDesc: { fontSize: 11, color: '#555' },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1B8A4C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  downloadText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F8F8F8', gap: 12 },
  settingIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFCDD2' },
  logoutText: { color: '#E53935', fontWeight: '700', fontSize: 15 },
  versionText: { textAlign: 'center', color: '#CCC', fontSize: 12, marginBottom: 8 },
});