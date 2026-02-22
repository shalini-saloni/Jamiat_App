import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MONEY_ALLOCATION = [
  { label: 'Food & Clean Water', percent: 60, icon: 'restaurant', color: '#1B8A4C' },
  { label: 'Medical Supplies', percent: 25, icon: 'medical', color: '#2196F3' },
  { label: 'Temporary Shelter', percent: 15, icon: 'home', color: '#FF9800' },
];

const LIVE_UPDATES = [
  {
    time: '2 HOURS AGO',
    text: 'Truckload of essential medicine and surgical kits arrived at Relief Camp A in Nagaon district.',
    emoji: '🏥',
  },
  {
    time: '6 HOURS AGO',
    text: '500 hot meals distributed to displaced families in Sector 4. Our mobile kitchen is moving to Sector 5 next.',
    emoji: '🍲',
  },
  {
    time: '1 DAY AGO',
    text: '3 new temporary shelters constructed in Barpeta using tarpaulin and bamboo provided by donors.',
    emoji: '⛺',
  },
];

const STATS = [
  { num: '5,000+', label: 'Meals', icon: 'restaurant' },
  { num: '1,200', label: 'Medical', icon: 'medical' },
  { num: '350', label: 'Shelters', icon: 'home' },
];

export default function CampaignScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const campaign = route?.params?.campaign || {
    title: 'Emergency Flood Relief - Assam 2024',
    tag: 'URGENT',
    color: '#1B6B3A',
    emoji: '🌊',
    raised: 45000,
    goal: 100000,
    percent: 45,
  };

  const raised = campaign.raised || 45000;
  const goal = campaign.goal || 100000;
  const percent = campaign.percent || 45;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaign Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="share-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={[styles.heroImage, { backgroundColor: campaign.color || '#1B6B3A' }]}>
          <Text style={styles.heroEmoji}>{campaign.emoji || '🌊'}</Text>
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>{campaign.tag || 'URGENT'}</Text>
          </View>
        </View>

        {/* Campaign Info */}
        <View style={styles.infoCard}>
          <Text style={styles.campaignTitle}>{campaign.title || 'Emergency Flood Relief - Assam 2024'}</Text>
          <Text style={styles.amountRaised}>₹{(raised / 1000).toFixed(0)},000</Text>
          <View style={styles.progressRow}>
            <Text style={styles.goalText}>raised of ₹{(goal / 1000).toFixed(0)},000 goal</Text>
            <Text style={styles.percentText}>{percent}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
          <Text style={styles.donorCount}>1,240 Donors contributed</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name={s.icon} size={18} color="#1B8A4C" />
              </View>
              <Text style={styles.statNum}>{s.num}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this campaign</Text>
          <Text style={styles.aboutText} numberOfLines={expanded ? undefined : 4}>
            Assam is currently facing one of its worst flood crises in recent years. Thousands of families who have lost their homes and are struggling for basic necessities like food, clean water, and medicine. Jamiat Ulema-i-Hind has deployed teams across 12 affected districts to provide immediate relief. Your contribution helps us reach the most remote areas.
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMoreBtn}>{expanded ? 'Read Less ›' : 'Read More ›'}</Text>
          </TouchableOpacity>
        </View>

        {/* Where money goes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where your money goes</Text>
          {MONEY_ALLOCATION.map((m, i) => (
            <View key={i} style={styles.allocationItem}>
              <View style={styles.allocationLeft}>
                <View style={[styles.allocationIcon, { backgroundColor: m.color + '20' }]}>
                  <Ionicons name={m.icon} size={16} color={m.color} />
                </View>
                <Text style={styles.allocationLabel}>{m.label}</Text>
              </View>
              <View style={styles.allocationRight}>
                <View style={styles.allocationBarBg}>
                  <View style={[styles.allocationBarFill, { width: `${m.percent}%`, backgroundColor: m.color }]} />
                </View>
                <Text style={styles.allocationPct}>{m.percent}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Live Updates */}
        <View style={styles.section}>
          <View style={styles.liveHeader}>
            <View style={styles.liveDot} />
            <Text style={styles.sectionTitle}>Live Updates</Text>
          </View>
          {LIVE_UPDATES.map((u, i) => (
            <View key={i} style={styles.updateItem}>
              <View style={styles.updateEmoji}>
                <Text style={{ fontSize: 20 }}>{u.emoji}</Text>
              </View>
              <View style={styles.updateContent}>
                <Text style={styles.updateTime}>{u.time}</Text>
                <Text style={styles.updateText}>{u.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Donate Button */}
      <View style={[styles.donateFooter, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.donateBtn}
          onPress={() => navigation.navigate('Donation')}
        >
          <Text style={styles.donateBtnText}>Donate Now ♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  heroImage: { height: 200, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 70 },
  urgentBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: '#FF4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  urgentText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  infoCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  campaignTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 10, lineHeight: 24 },
  amountRaised: { fontSize: 28, fontWeight: '800', color: '#1B8A4C', marginBottom: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalText: { fontSize: 12, color: '#888' },
  percentText: { fontSize: 12, color: '#1B8A4C', fontWeight: '700' },
  progressBg: { height: 8, backgroundColor: '#E8F5E9', borderRadius: 4, marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: '#1B8A4C', borderRadius: 4 },
  donorCount: { fontSize: 11, color: '#999' },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statItem: { flex: 1, alignItems: 'center' },
  statIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statNum: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#999', fontWeight: '500' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  aboutText: { fontSize: 13, color: '#555', lineHeight: 20 },
  readMoreBtn: { color: '#1B8A4C', fontWeight: '700', fontSize: 13, marginTop: 8 },
  allocationItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  allocationLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  allocationIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  allocationLabel: { fontSize: 13, color: '#333', fontWeight: '500' },
  allocationRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' },
  allocationBarBg: { width: 90, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3 },
  allocationBarFill: { height: 6, borderRadius: 3 },
  allocationPct: { fontSize: 12, fontWeight: '700', color: '#555', width: 30, textAlign: 'right' },
  liveHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4444' },
  updateItem: { flexDirection: 'row', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  updateEmoji: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  updateContent: { flex: 1 },
  updateTime: { fontSize: 10, fontWeight: '700', color: '#999', letterSpacing: 0.5, marginBottom: 4 },
  updateText: { fontSize: 12, color: '#444', lineHeight: 18 },
  donateFooter: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 8 },
  donateBtn: { backgroundColor: '#1B8A4C', paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  donateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
