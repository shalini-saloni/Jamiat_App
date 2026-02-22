import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const TIMELINE = [
  { date: 'OCT 2023', title: 'Handpump Installed in Bihar', desc: 'Your Zakat helped provide clean water in a village of 40 households' },
  { date: 'JUN 2023', title: 'Eid Food Kit Distribution', desc: '10 families in New Delhi received essential groceries for a month' },
  { date: 'MAR 2023', title: 'Ramadan Relief Package', desc: 'Your donation fed 25 families for the entire month of Ramadan' },
];

const MONEY_USES = [
  { label: 'Food & Relief', percent: 60, color: '#1B8A4C' },
  { label: 'Medical Aid', percent: 25, color: '#2196F3' },
  { label: 'Education', percent: 15, color: '#FF9800' },
];

const DONATION_ICONS = { moon: 'moon', heart: 'heart', star: 'star', water: 'water', school: 'school', medical: 'medical' };

export default function ImpactScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, donations, totalImpact, logout } = useApp();

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const livesTouched = Math.floor(totalImpact / 200);
  const campaigns = donations.length;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Impact Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="settings-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <LinearGradient colors={['#1B8A4C', '#0D5C30']} style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{getInitials(user?.name)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileGreeting}>Assalamu Alaikum, {user?.name}</Text>
              <Text style={styles.profileMeta}>Member since {user?.memberSince} • {user?.memberId}</Text>
              <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Total Impact */}
        <View style={styles.impactCard}>
          <Text style={styles.impactCardLabel}>TOTAL IMPACT</Text>
          <Text style={styles.impactCardAmount}>₹{totalImpact.toLocaleString()}</Text>
          {totalImpact === 0 && <Text style={styles.zeroImpactHint}>Make your first donation to see your impact!</Text>}
          <View style={styles.impactStatsRow}>
            <View style={styles.impactStat}>
              <Text style={styles.impactStatNum}>{livesTouched > 0 ? `${livesTouched}+` : '0'}</Text>
              <Text style={styles.impactStatLabel}>LIVES TOUCHED</Text>
            </View>
            <View style={styles.impactDivider} />
            <View style={styles.impactStat}>
              <Text style={styles.impactStatNum}>{campaigns}</Text>
              <Text style={styles.impactStatLabel}>DONATIONS</Text>
            </View>
            <View style={styles.impactDivider} />
            <View style={styles.impactStat}>
              <Text style={styles.impactStatNum}>{donations.filter(d => d.recurring).length}</Text>
              <Text style={styles.impactStatLabel}>RECURRING</Text>
            </View>
          </View>
        </View>

        {/* 80G Tax Receipt */}
        {totalImpact > 0 && (
          <View style={styles.taxCard}>
            <View style={styles.taxIcon}><Ionicons name="document-text" size={20} color="#1B8A4C" /></View>
            <View style={styles.taxMiddle}>
              <Text style={styles.taxTitle}>Tax Savings (80G)</Text>
              <Text style={styles.taxDesc}>Download your FY 2023-24 tax-exempt certificate now.</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn} onPress={() => Alert.alert('80G Receipt', 'Your 80G tax receipt will be emailed to ' + user?.email)}>
              <Ionicons name="download-outline" size={14} color="#fff" />
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Impact Timeline */}
        {totalImpact > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Impact Timeline</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            {TIMELINE.map((t, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot} />
                  {i < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineDate}>{t.date}</Text>
                  <Text style={styles.timelineTitle}>{t.title}</Text>
                  <Text style={styles.timelineDesc}>{t.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Donation History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Donation History</Text>
            <TouchableOpacity><Text style={styles.seeAll}>View Statement</Text></TouchableOpacity>
          </View>
          {donations.length === 0 ? (
            <View style={styles.emptyDonations}>
              <Text style={styles.emptyDonationsEmoji}>🤲</Text>
              <Text style={styles.emptyDonationsText}>No donations yet</Text>
              <TouchableOpacity style={styles.donateNowBtn} onPress={() => navigation.navigate('Donation')}>
                <Text style={styles.donateNowBtnText}>Make Your First Donation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            donations.map((d, i) => (
              <View key={d.id || i} style={styles.donationItem}>
                <View style={styles.donationIconBox}>
                  <Ionicons name={DONATION_ICONS[d.icon] || 'heart'} size={18} color="#1B8A4C" />
                </View>
                <View style={styles.donationInfo}>
                  <Text style={styles.donationName}>{d.name}</Text>
                  <Text style={styles.donationDate}>{d.date} • {d.type?.toUpperCase()}{d.recurring ? ' • 🔁 Monthly' : ''}</Text>
                </View>
                <Text style={styles.donationAmount}>₹{d.amount.toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>

        

        {/* Settings */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="person-outline" size={20} color="#555" />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={20} color="#555" />
            <Text style={styles.settingText}>Notification Preferences</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="lock-closed-outline" size={20} color="#555" />
            <Text style={styles.settingText}>Security & App PIN</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E53935" />
            <Text style={[styles.settingText, { color: '#E53935' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  profileCard: { margin: 16, borderRadius: 16, padding: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  profileAvatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FF9800', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  profileAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 22 },
  profileInfo: { flex: 1 },
  profileGreeting: { color: '#fff', fontWeight: '700', fontSize: 14 },
  profileMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 3, marginBottom: 8 },
  editProfileBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  editProfileText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  impactCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  impactCardLabel: { fontSize: 10, fontWeight: '700', color: '#1B8A4C', letterSpacing: 1, marginBottom: 4 },
  impactCardAmount: { fontSize: 34, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  zeroImpactHint: { fontSize: 12, color: '#999', marginBottom: 8, fontStyle: 'italic' },
  impactStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  impactStat: { flex: 1, alignItems: 'center' },
  impactStatNum: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  impactStatLabel: { fontSize: 9, color: '#999', fontWeight: '600', letterSpacing: 0.5, textAlign: 'center', marginTop: 2 },
  impactDivider: { width: 1, height: 36, backgroundColor: '#E0E0E0' },
  taxCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#E8F5E9', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  taxIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  taxMiddle: { flex: 1 },
  taxTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  taxDesc: { fontSize: 11, color: '#555', lineHeight: 16 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1B8A4C', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  downloadText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  seeAll: { color: '#1B8A4C', fontSize: 13, fontWeight: '600' },
  emptyDonations: { alignItems: 'center', paddingVertical: 20 },
  emptyDonationsEmoji: { fontSize: 36, marginBottom: 8 },
  emptyDonationsText: { fontSize: 14, color: '#999', marginBottom: 14 },
  donateNowBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  donateNowBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  donationItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  donationIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  donationInfo: { flex: 1 },
  donationName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  donationDate: { fontSize: 11, color: '#999' },
  donationAmount: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  timelineItem: { flexDirection: 'row', marginBottom: 16 },
  timelineLeft: { alignItems: 'center', marginRight: 14, width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1B8A4C', marginTop: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E0E0E0', marginTop: 4 },
  timelineContent: { flex: 1 },
  timelineDate: { fontSize: 10, fontWeight: '700', color: '#1B8A4C', letterSpacing: 0.5, marginBottom: 3 },
  timelineTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 3 },
  timelineDesc: { fontSize: 12, color: '#666', lineHeight: 17 },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 12 },
  settingText: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
});
