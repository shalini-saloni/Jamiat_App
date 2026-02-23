import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export const CAMPAIGNS = [
  {
    id: 1, tag: 'URGENT', tagColor: '#E53935', title: 'Assam Flood Relief 2024',
    desc: 'Providing food, clean water, and shelter to thousands affected by heavy floods',
    raised: 154000, goal: 2500000, percent: 62, color: '#1B6B3A', category: 'Food',
    image: require('../../assets/Assam_flood_relief.jpg'),
  },
  {
    id: 2, tag: 'EDUCATION', tagColor: '#F5A623', title: 'Orphan Education Fund',
    desc: 'Sponsoring quality education for underprivileged children across rural India',
    raised: 140000, goal: 300000, percent: 60, color: '#2E7D32', category: 'Education',
    image: require('../../assets/Education_for_all.jpeg'),
  },
  {
    id: 3, tag: 'HEALTH', tagColor: '#9C27B0', title: 'Medical Aid for Gaza',
    desc: 'Providing emergency medical supplies and trauma care to hospitals facing critical shortages',
    raised: 375000, goal: 500000, percent: 75, color: '#4A148C', category: 'Health',
    image: require('../../assets/Medical_Aid_Gaza.jpg'),
  },
  {
    id: 4, tag: 'WATER', tagColor: '#2196F3', title: 'Clean Water Hand Pumps',
    desc: 'Installing durable hand pumps in villages with no access to safe drinking water',
    raised: 50400, goal: 120000, percent: 42, color: '#0D47A1', category: 'Water',
    image: require('../../assets/Clean_water_yemen.jpg'),
  },
  {
    id: 5, tag: 'ZAKAT', tagColor: '#1B8A4C', title: 'Zakat Distribution',
    desc: 'Annual Zakat distribution for poor families across India',
    raised: 120000, goal: 200000, percent: 60, color: '#1B5E20', category: 'Zakat',
    image: require('../../assets/Zakat_distribution.jpg'),
  },
  {
    id: 6, tag: 'FOOD', tagColor: '#FF5722', title: 'Ramadan Food Pack',
    desc: 'Food baskets for deserving families this Ramadan',
    raised: 38000, goal: 60000, percent: 63, color: '#BF360C', category: 'Food',
    image: require('../../assets/Ramadan_food_pack.jpeg'),
  },
];

export const IMPACT_STORIES = [
  {
    id: 1, title: 'Clean Water in Mewat',
    desc: 'Installed 5 hand pumps providing clean water to 200 families',
    storyTag: 'SUCCESS STORY',
    fullStory: 'A brand-new community kitchen has been opened in the heart of Gaya, Bihar, thanks to the generous contributions of Jamiat donors. The kitchen serves over 200 daily wage workers and their families who previously had no access to a proper meal during the day.\n\nFamilies who used to skip meals can now depend on this kitchen for one nutritious meal a day. Children are also benefiting, with a special evening meal program.',
    daysAgo: '2 days ago', readTime: '2 MIN READ', category: 'CLEAN WATER', color: '#0D47A1',
    image: require('../../assets/Clean_water_project.jpg'),
    quote: 'We used to walk hours for water. Now clean water is right here.',
    quotePerson: 'Ahmed, Village Elder',
    impact: [{ num: '200+', label: 'Families helped' }, { num: '5', label: 'Pumps installed' }],
  },
  {
    id: 2, title: 'Free Eye Surgery Camp',
    desc: '150 successful cataract surgeries performed this weekend in...',
    storyTag: 'SUCCESS STORY',
    fullStory: 'Jamiat medical teams organised a free eye surgery camp serving over 150 patients this weekend. Cataract surgeries were performed by specialist doctors who volunteered their time. Many patients had been unable to see properly for years due to lack of access to medical care.\n\nThis camp is part of our ongoing Sehat initiative which aims to bring primary healthcare to underserved communities across India.',
    daysAgo: '5 days ago', readTime: '3 MIN READ', category: 'MEDICAL AID', color: '#4A148C',
    image: require('../../assets/Medical_aid.png'),
    quote: 'I can see my grandchildren clearly for the first time.',
    quotePerson: 'Amina, Surgery Recipient',
    impact: [{ num: '150+', label: 'Surgeries done' }, { num: '0', label: 'Cost to patients' }],
  },
  {
    id: 3, title: 'New community kitchen opened in Bihar',
    desc: 'Serving 200+ low income daily wage earners',
    storyTag: 'SUCCESS STORY',
    fullStory: 'A brand-new community kitchen serves over 200 daily wage workers and their families who previously had no access to a proper meal during the day. The initiative is part of Jamiat\'s broader effort to address hunger and food insecurity.',
    daysAgo: '1 week ago', readTime: '2 MIN READ', category: 'FOOD SECURITY', color: '#BF360C',
    image: require('../../assets/Community_kitchen.jpg'),
    quote: 'My children now eat a proper meal every evening.',
    quotePerson: 'Fatima, Daily Wage Worker',
    impact: [{ num: '200+', label: 'People fed daily' }, { num: '40+', label: 'Children helped' }],
  },
];

const FILTER_CHIPS = ['All', 'General', 'Sadaqa', 'Zakat Eligible', 'Interest Earning'];

const QUICK_DONATIONS = [
  { icon: 'mosque',             label: 'Zakat',    sub: 'OBLIGATORY',    type: 'Zakat',    color: '#1B8A4C', bg: '#E8F5E9' },
  { icon: 'hand-holding-heart', label: 'Sadaqa',   sub: 'VOLUNTARY',     type: 'Sadaqa',   color: '#E91E8C', bg: '#FCE4EC' },
  { icon: 'store',              label: 'General',  sub: 'FOUNDATION FUND', type: 'General', color: '#F57C00', bg: '#FFF3E0' },
  { icon: 'chart-line',         label: 'Interest', sub: 'PURIFICATION',  type: 'Interest', color: '#E53935', bg: '#FFEBEE' },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {/* Logo row */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <FontAwesome5 name="mosque" size={16} color="#1B8A4C" />
          </View>
          <Text style={styles.logoText}>Jamiat Foundation</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Quran verse card */}
        <View style={styles.verseCard}>
          <Text style={styles.verseLabel}>QURAN VERSE</Text>
          <Text style={styles.verseText}>
            "And whatever you spend in good - it{'\n'}is for yourselves"
          </Text>
          <Text style={styles.verseRef}>Al-Baqarah 2:272</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>50K+</Text>
            <Text style={styles.statLabel}>Lives</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>₹2.4Cr</Text>
            <Text style={styles.statLabel}>Raised</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>12K+</Text>
            <Text style={styles.statLabel}>Donors</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#aaa" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns..."
              placeholderTextColor="#bbb"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => {
                if (search.trim()) navigation.navigate('Project', { searchQuery: search });
              }}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {FILTER_CHIPS.map((chip) => (
            <TouchableOpacity key={chip} onPress={() => setActiveFilter(chip)} activeOpacity={0.8}>
              <View style={{ backgroundColor: activeFilter === chip ? '#1B8A4C' : '#F0F0F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: activeFilter === chip ? '#fff' : '#555' }}>{chip}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Urgent Campaigns */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Campaigns</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Project')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CAMPAIGNS.slice(0, 4).map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.campaignCard}
                onPress={() => navigation.navigate('Campaign', { campaign: c })}
              >
                <View style={styles.campaignImgBox}>
                  <Image source={c.image} style={styles.campaignImg} />
                  <View style={[styles.tagBadge, { backgroundColor: c.tagColor }]}>
                    <Text style={styles.tagText}>{c.tag}</Text>
                  </View>
                </View>
                <View style={styles.campaignBody}>
                  <Text style={styles.campaignTitle} numberOfLines={1}>{c.title}</Text>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${c.percent}%` }]} />
                  </View>
                  <View style={styles.raisedRow}>
                    <View>
                      <Text style={styles.raisedLabel}>Raised: <Text style={styles.raisedAmt}>₹{(c.raised/100000).toFixed(1)}L</Text></Text>
                      <Text style={styles.goalLabel}>Goal: ₹{(c.goal/100000).toFixed(0)}L</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.donateNowBtn}
                    onPress={() => navigation.navigate('Donation', { campaign: c })}
                  >
                    <Text style={styles.donateNowText}>Donate Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Donation 2×2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Donation</Text>
          <View style={styles.quickGrid}>
            {QUICK_DONATIONS.map((q) => (
              <TouchableOpacity
                key={q.label}
                style={[styles.quickItem, { borderTopColor: q.color }]}
                onPress={() => navigation.navigate('Donate', { screen: 'Donate', params: { donationType: q.type } })}
              >
                <View style={[styles.quickIcon, { backgroundColor: q.bg }]}>
                  <FontAwesome5 name={q.icon} size={22} color={q.color} />
                </View>
                <Text style={styles.quickLabel}>{q.label}</Text>
                <Text style={styles.quickSub}>{q.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Giving Banner */}
        <View style={styles.sectionPad}>
          <TouchableOpacity
            style={styles.dailyBanner}
            onPress={() => navigation.navigate('Donation', { donationType: 'Sadaqa', frequency: 'Daily' })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.dailyTitle}>Start Your Daily Giving</Text>
              <Text style={styles.dailySub}>Just ₹1/Day</Text>
              <View style={styles.dailyBtn}>
                <Text style={styles.dailyBtnText}>Set Up Now</Text>
              </View>
            </View>
            <Text style={{ fontSize: 48 }}>🌱</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Impact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Impact</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
              <Text style={styles.viewAll}>Read More</Text>
            </TouchableOpacity>
          </View>
          {IMPACT_STORIES.slice(0, 2).map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.storyCard}
              onPress={() => navigation.navigate('Story', { story: s })}
            >
              <Image source={s.image} style={styles.storyImg} />
              <View style={styles.storyBody}>
                <Text style={styles.storyTag}>{s.storyTag}</Text>
                <Text style={styles.storyTitle} numberOfLines={1}>{s.title}</Text>
                <Text style={styles.storyDesc} numberOfLines={2}>{s.desc}</Text>
                <View style={styles.storyMeta}>
                  <Ionicons name="time-outline" size={11} color="#bbb" />
                  <Text style={styles.storyTime}> {s.daysAgo}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header: { backgroundColor: '#1B8A4C', paddingHorizontal: 16, paddingBottom: 0 },
  logoRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, marginBottom: 12 },
  logoBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  notifBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },

  // Verse card
  verseCard: { backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 14, padding: 14, marginBottom: 14 },
  verseLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginBottom: 6 },
  verseText: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 6 },
  verseRef: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'right' },

  // Stats
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 0, marginHorizontal: -4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 4 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#EEE', marginHorizontal: 6 },

  // Search
  searchWrap: { paddingHorizontal: 16, marginTop: 14, marginBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },

  // Chips
  chipRow: { paddingHorizontal: 16, paddingBottom: 10 },

  // Sections
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionPad: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  viewAll: { color: '#1B8A4C', fontSize: 13, fontWeight: '600' },

  // Campaign cards
  campaignCard: { width: 240, backgroundColor: '#fff', borderRadius: 14, marginRight: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  campaignImgBox: { height: 140, position: 'relative' },
  campaignImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  tagBadge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  campaignBody: { padding: 12 },
  campaignTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  progressBg: { height: 5, backgroundColor: '#E8F5E9', borderRadius: 3, marginBottom: 8 },
  progressFill: { height: 5, backgroundColor: '#1B8A4C', borderRadius: 3 },
  raisedRow: { marginBottom: 10 },
  raisedLabel: { fontSize: 12, color: '#555' },
  raisedAmt: { fontWeight: '700', color: '#1A1A1A' },
  goalLabel: { fontSize: 11, color: '#999', marginTop: 1 },
  donateNowBtn: { backgroundColor: '#1B8A4C', paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  donateNowText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Quick donation 2×2
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickItem: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  quickIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  quickSub: { fontSize: 9, color: '#aaa', fontWeight: '700', letterSpacing: 0.5 },

  // Daily giving
  dailyBanner: { backgroundColor: '#F5A623', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center' },
  dailyTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  dailySub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 14 },
  dailyBtn: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  dailyBtnText: { color: '#F5A623', fontWeight: '800', fontSize: 13 },

  // Stories
  storyCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  storyImg: { width: 90, height: 95, resizeMode: 'cover' },
  storyBody: { flex: 1, padding: 10 },
  storyTag: { fontSize: 9, fontWeight: '800', color: '#1B8A4C', letterSpacing: 0.5, marginBottom: 4 },
  storyTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 3 },
  storyDesc: { fontSize: 11, color: '#777', lineHeight: 15, marginBottom: 4 },
  storyMeta: { flexDirection: 'row', alignItems: 'center' },
  storyTime: { fontSize: 10, color: '#bbb' },
});