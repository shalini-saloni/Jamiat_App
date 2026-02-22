import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Image, ImageBackground
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CAMPAIGNS = [
  {
    id: 1,
    tag: 'URGENT',
    tagColor: '#FF4444',
    title: 'Assam Flood Relief',
    desc: 'Providing flood, clean water, and shelter to thousands affected by heavy floods',
    raised: 31000,
    goal: 50000,
    percent: 62,
    color: '#1B6B3A',
    emoji: '🌊',
  },
  {
    id: 2,
    tag: 'EDUCATION',
    tagColor: '#F5A623',
    title: 'Education for All',
    desc: 'Sponsoring quality education for underprivileged children across rural India',
    raised: 18000,
    goal: 30000,
    percent: 60,
    color: '#2E7D32',
    emoji: '📚',
  },
];

const QUICK_DONATIONS = [
  { icon: 'mosque', label: 'Zakat', lib: 'FontAwesome5' },
  { icon: 'hand-holding-heart', label: 'Sadaqa', lib: 'FontAwesome5' },
  { icon: 'globe', label: 'General', lib: 'FontAwesome5' },
  { icon: 'hands-helping', label: 'Relief', lib: 'FontAwesome5' },
];

const IMPACT_STORIES = [
  {
    id: 1,
    title: 'New community kitchen opened in Bihar',
    desc: 'Serving 200+ low income daily wage earners',
    date: 'Oct 15, 2023 • 2 MINS',
    emoji: '🍲',
  },
  {
    id: 2,
    title: 'Clean water project completed in Yemen',
    desc: 'Safe drinking water accessible to over 1,500 villages',
    date: 'Sep 22, 2023 • 3 MINS',
    emoji: '💧',
  },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={['#1B8A4C', '#0D5C30']} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Assalamu Alaikum,</Text>
              <Text style={styles.userName}>Ahmed Abdullah</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Impact Banner */}
        <TouchableOpacity
          style={styles.impactBanner}
          onPress={() => navigation.navigate('Impact')}
        >
          <View>
            <Text style={styles.impactLabel}>Your Total Impact</Text>
            <Text style={styles.impactNumber}>12 Families</Text>
            <Text style={styles.impactSub}>Supported through your generous contributions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#999" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns, e.g. Assam Relief"
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Urgent Relief */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Relief</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CAMPAIGNS.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.campaignCard}
                onPress={() => navigation.navigate('Campaign', { campaign: c })}
              >
                <View style={[styles.campaignImage, { backgroundColor: c.color }]}>
                  <Text style={{ fontSize: 40 }}>{c.emoji}</Text>
                  <View style={[styles.tagBadge, { backgroundColor: c.tagColor }]}>
                    <Text style={styles.tagText}>{c.tag}</Text>
                  </View>
                </View>
                <View style={styles.campaignBody}>
                  <Text style={styles.campaignTitle} numberOfLines={1}>{c.title}</Text>
                  <Text style={styles.campaignDesc} numberOfLines={2}>{c.desc}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBg}>
                      <View style={[styles.progressFill, { width: `${c.percent}%` }]} />
                    </View>
                    <Text style={styles.progressPct}>{c.percent}%</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.raisedText}>₹{(c.raised / 1000).toFixed(0)}k raised</Text>
                    <TouchableOpacity style={styles.donateBtn}>
                      <Text style={styles.donateBtnText}>Donate</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Donation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Donation</Text>
          <View style={styles.quickGrid}>
            {QUICK_DONATIONS.map((q) => (
              <TouchableOpacity
                key={q.label}
                style={styles.quickItem}
                onPress={() => navigation.navigate('Donation', { type: q.label })}
              >
                <View style={styles.quickIcon}>
                  <FontAwesome5 name={q.icon} size={22} color="#1B8A4C" />
                </View>
                <Text style={styles.quickLabel}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Impact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Impact</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>See Stories</Text>
            </TouchableOpacity>
          </View>
          {IMPACT_STORIES.map((s) => (
            <View key={s.id} style={styles.storyCard}>
              <View style={styles.storyImageBox}>
                <Text style={{ fontSize: 32 }}>{s.emoji}</Text>
              </View>
              <View style={styles.storyBody}>
                <Text style={styles.storyTitle}>{s.title}</Text>
                <Text style={styles.storyDesc} numberOfLines={2}>{s.desc}</Text>
                <Text style={styles.storyDate}>{s.date}</Text>
                <TouchableOpacity>
                  <Text style={styles.readMore}>READ FULL STORY ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF9800', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  notifBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  impactBanner: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  impactLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 },
  impactNumber: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  impactSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  scroll: { flex: 1 },
  searchRow: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  viewAll: { color: '#1B8A4C', fontSize: 13, fontWeight: '600' },
  campaignCard: { width: 220, backgroundColor: '#fff', borderRadius: 14, marginRight: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  campaignImage: { height: 130, alignItems: 'center', justifyContent: 'center' },
  tagBadge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  campaignBody: { padding: 12 },
  campaignTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  campaignDesc: { fontSize: 11, color: '#777', marginBottom: 8, lineHeight: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressBg: { flex: 1, height: 5, backgroundColor: '#E8F5E9', borderRadius: 3, marginRight: 8 },
  progressFill: { height: 5, backgroundColor: '#1B8A4C', borderRadius: 3 },
  progressPct: { fontSize: 11, color: '#1B8A4C', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  raisedText: { fontSize: 11, color: '#555' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  donateBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickItem: { alignItems: 'center', flex: 1 },
  quickIcon: { width: 60, height: 60, borderRadius: 16, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 13, color: '#333', fontWeight: '500' },
  storyCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  storyImageBox: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  storyBody: { flex: 1 },
  storyTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 4, lineHeight: 18 },
  storyDesc: { fontSize: 11, color: '#777', marginBottom: 4, lineHeight: 15 },
  storyDate: { fontSize: 10, color: '#999', marginBottom: 4 },
  readMore: { fontSize: 10, color: '#1B8A4C', fontWeight: '700', letterSpacing: 0.5 },
});
