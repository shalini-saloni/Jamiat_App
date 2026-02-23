import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export const CAMPAIGNS = [
  {
    id: 1, tag: 'URGENT', tagColor: '#FF4444', title: 'Assam Flood Relief',
    desc: 'Providing food, clean water, and shelter to thousands affected by heavy floods',
    raised: 31000, goal: 50000, percent: 62, color: '#1B6B3A', emoji: '🌊', category: 'Relief',
    image: require('../../assets/Assam_flood_relief.jpg'),
  },
  {
    id: 2, tag: 'EDUCATION', tagColor: '#F5A623', title: 'Education for All',
    desc: 'Sponsoring quality education for underprivileged children across rural India',
    raised: 18000, goal: 30000, percent: 60, color: '#2E7D32', emoji: '📚', category: 'Education',
    image: require('../../assets/Education_for_all.jpeg'),
  },
  {
    id: 3, tag: 'HEALTH', tagColor: '#9C27B0', title: 'Medical Aid Gaza',
    desc: 'Urgent medical support and supplies for families in critical need',
    raised: 55000, goal: 80000, percent: 69, color: '#4A148C', emoji: '🏥', category: 'Health',
    image: require('../../assets/Medical_Aid_Gaza.jpg'),
  },
  {
    id: 4, tag: 'WATER', tagColor: '#2196F3', title: 'Clean Water Yemen',
    desc: 'Providing safe drinking water to remote villages across Yemen',
    raised: 22000, goal: 40000, percent: 55, color: '#0D47A1', emoji: '💧', category: 'Relief',
    image: require('../../assets/Clean_water_yemen.jpg'),
  },
  {
    id: 5, tag: 'ZAKAT', tagColor: '#1B8A4C', title: 'Zakat Distribution',
    desc: 'Annual Zakat distribution for poor families across India',
    raised: 120000, goal: 200000, percent: 60, color: '#1B5E20', emoji: '🤲', category: 'Zakat',
    image: require('../../assets/Zakat_distribution.jpg'),
  },
  {
    id: 6, tag: 'FOOD', tagColor: '#FF5722', title: 'Ramadan Food Pack',
    desc: 'Food baskets for deserving families this Ramadan',
    raised: 38000, goal: 60000, percent: 63, color: '#BF360C', emoji: '🌙', category: 'Food',
    image: require('../../assets/Ramadan_food_pack.jpeg'),
  },
];

export const IMPACT_STORIES = [
  {
    id: 1, title: 'New community kitchen opened in Bihar',
    desc: 'Serving 200+ low income daily wage earners',
    fullStory: 'A brand-new community kitchen has been opened in the heart of Gaya, Bihar, thanks to the generous contributions of Jamiat donors. The kitchen serves over 200 daily wage workers and their families who previously had no access to a proper meal during the day.\n\nThe facility is equipped with modern cooking equipment and a dedicated team of volunteers who prepare freshly cooked meals every day. The initiative is part of Jamiat\'s broader effort to address hunger and food insecurity in underprivileged communities.\n\nFamilies who used to skip meals can now depend on this kitchen for one nutritious meal a day. Children are also benefiting, with a special evening meal program for school-going children of daily wage workers.',
    date: 'Oct 15, 2023', readTime: '2 MIN READ', category: 'FOOD SECURITY', color: '#BF360C', emoji: '🍲',
    image: require('../../assets/Community_kitchen.jpg'),
    quote: 'This kitchen has changed our lives. My children now eat a proper meal every evening.',
    quotePerson: 'Fatima, Daily Wage Worker',
    impact: [{ num: '200+', label: 'People fed daily' }, { num: '3', label: 'Meals per day' }, { num: '40+', label: 'Children helped' }],
  },
  {
    id: 2, title: 'Clean water project completed in Yemen',
    desc: 'Safe drinking water accessible to over 1,500 villages',
    fullStory: 'After months of planning and construction, a major clean water project has been completed in rural Yemen, giving over 1,500 villages access to safe, clean drinking water for the first time in years.\n\nThe project involved drilling 12 deep water wells and installing a network of pipes. Water purification units ensure the water meets international safety standards.\n\nPrior to this project, women and children had to walk up to 5 kilometers daily to collect water from contaminated sources. The new infrastructure has already reduced reported cases of waterborne illness by 70%.',
    date: 'Sep 22, 2023', readTime: '3 MIN READ', category: 'CLEAN WATER', color: '#0D47A1', emoji: '💧',
    image: require('../../assets/Clean_water_project.jpg'),
    quote: 'We used to walk hours for water that made us sick. Now clean water is right here.',
    quotePerson: 'Ahmed, Village Elder',
    impact: [{ num: '1,500+', label: 'Villages helped' }, { num: '12', label: 'Wells drilled' }, { num: '70%', label: 'Less illness' }],
  },
  {
    id: 3, title: 'Medical aid reaches Gaza families',
    desc: 'Critical medicines and surgical kits delivered to 5,000+ families',
    fullStory: 'Jamiat medical teams have successfully delivered critical medicines and surgical supplies to over 5,000 families across Gaza. The mission involved coordinating with local partners to navigate access restrictions and ensure supplies reached those most in need.\n\nThe medical kits included antibiotics, wound care supplies, IV fluids, and essential surgical instruments. Doctors on the ground reported that the supplies were immediately deployed to treat patients who had been waiting for weeks.\n\nJamiat continues to support medical relief efforts and is planning a second shipment of supplies in the coming month.',
    date: 'Aug 10, 2023', readTime: '4 MIN READ', category: 'MEDICAL AID', color: '#4A148C', emoji: '🏥',
    image: require('../../assets/Medical_aid.png'),
    quote: 'These medicines saved lives that would have been lost without them.',
    quotePerson: 'Dr. Hassan, Field Coordinator',
    impact: [{ num: '5,000+', label: 'Families helped' }, { num: '3', label: 'Medical teams' }, { num: '12', label: 'Hospitals supplied' }],
  },
];

const QUICK_DONATIONS = [
  { icon: 'mosque',             label: 'Zakat',    type: 'Zakat' },
  { icon: 'hand-holding-heart', label: 'Sadaqa',   type: 'Sadaqa' },
  { icon: 'globe',              label: 'General',  type: 'General' },
  { icon: 'chart-line',         label: 'Interest', type: 'Interest' },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, totalImpact, donations } = useApp();
  const [search, setSearch] = useState('');

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const familiesImpacted = Math.floor((totalImpact || 0) / 500) + (donations.length > 0 ? 1 : 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#1B8A4C', '#0D5C30']} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Assalamu Alaikum,</Text>
              <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.impactBanner} onPress={() => navigation.navigate('MyImpact')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.impactLabel}>Your Total Impact</Text>
            <Text style={styles.impactNumber}>
              {familiesImpacted > 0 ? `${familiesImpacted} ${familiesImpacted === 1 ? 'Family' : 'Families'}` : 'Start Giving'}
            </Text>
            <Text style={styles.impactSub}>
              {totalImpact > 0
                ? `₹${totalImpact.toLocaleString()} donated across ${donations.length} donation${donations.length !== 1 ? 's' : ''}`
                : 'Make your first donation today'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#999" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns, e.g. Assam Relief"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => { if (search.trim()) navigation.navigate('Project', { searchQuery: search }); }}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>
        </View>

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
              <TouchableOpacity key={c.id} style={styles.campaignCard} onPress={() => navigation.navigate('Campaign', { campaign: c })}>
                <View style={styles.campaignImageBox}>
                  <Image source={c.image} style={styles.campaignImage} />
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
                    <View>
                      <Text style={styles.raisedText}>₹{(c.raised / 1000).toFixed(0)}k raised</Text>
                      <Text style={styles.goalText}>of ₹{(c.goal / 1000).toFixed(0)}k goal</Text>
                    </View>
                    <TouchableOpacity style={styles.donateBtn} onPress={() => navigation.navigate('Donation', { campaign: c })}>
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
              <TouchableOpacity key={q.label} style={styles.quickItem} onPress={() => navigation.navigate('Donation', { donationType: q.type })}>
                <View style={styles.quickIcon}>
                  <FontAwesome5 name={q.icon} size={20} color="#1B8A4C" />
                </View>
                <Text style={styles.quickLabel}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Your Daily Giving Banner */}
        <View style={styles.sectionPad}>
          <TouchableOpacity style={styles.dailyGivingBanner} onPress={() => navigation.navigate('Donation', { donationType: 'Sadaqa', frequency: 'Daily' })}>
            <View style={styles.dailyGivingLeft}>
              <Text style={styles.dailyGivingTitle}>Start Your Daily Giving</Text>
              <Text style={styles.dailyGivingSubtitle}>Just ₹10/day • Change a life forever</Text>
              <View style={styles.dailyGivingBtn}>
                <Text style={styles.dailyGivingBtnText}>Set Up Now</Text>
              </View>
            </View>
            <Text style={{ fontSize: 44 }}>🌱</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Impact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Impact</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
              <Text style={styles.viewAll}>See Stories</Text>
            </TouchableOpacity>
          </View>
          {IMPACT_STORIES.slice(0, 2).map((s) => (
            <TouchableOpacity key={s.id} style={styles.storyCard} onPress={() => navigation.navigate('Story', { story: s })}>
              <Image source={s.image} style={styles.storyImage} />
              <View style={styles.storyBody}>
                <Text style={styles.storyTitle}>{s.title}</Text>
                <Text style={styles.storyDesc} numberOfLines={2}>{s.desc}</Text>
                <Text style={styles.storyDate}>{s.date} • {s.readTime}</Text>
                <Text style={styles.readMore}>READ FULL STORY ›</Text>
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
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, marginBottom: 14 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FF9800', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  notifBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  impactBanner: { backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  impactLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 4 },
  impactNumber: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  impactSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  searchRow: { paddingHorizontal: 16, marginTop: 14, marginBottom: 6 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },
  section: { paddingHorizontal: 16, marginBottom: 22 },
  sectionPad: { paddingHorizontal: 16, marginBottom: 22 },
  dailyGivingBanner: { backgroundColor: '#F5A623', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dailyGivingLeft: { flex: 1 },
  dailyGivingTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 4 },
  dailyGivingSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 12 },
  dailyGivingBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start' },
  dailyGivingBtnText: { color: '#F5A623', fontWeight: '800', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  viewAll: { color: '#1B8A4C', fontSize: 13, fontWeight: '600' },
  campaignCard: { width: 230, backgroundColor: '#fff', borderRadius: 16, marginRight: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.09, shadowRadius: 6, elevation: 3 },
  campaignImageBox: { width: '100%', height: 140, position: 'relative' },
  campaignImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  tagBadge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  campaignBody: { padding: 12 },
  campaignTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  campaignDesc: { fontSize: 11, color: '#777', marginBottom: 8, lineHeight: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressBg: { flex: 1, height: 5, backgroundColor: '#E8F5E9', borderRadius: 3, marginRight: 8 },
  progressFill: { height: 5, backgroundColor: '#1B8A4C', borderRadius: 3 },
  progressPct: { fontSize: 11, color: '#1B8A4C', fontWeight: '700' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  raisedText: { fontSize: 12, color: '#1A1A1A', fontWeight: '600' },
  goalText: { fontSize: 10, color: '#999' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  donateBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickItem: { alignItems: 'center', flex: 1 },
  quickIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 13, color: '#333', fontWeight: '500' },
  storyCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 0, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, overflow: 'hidden' },
  storyImage: { width: 90, height: 90, resizeMode: 'cover' },
  storyBody: { flex: 1, padding: 10 },
  storyTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 4, lineHeight: 18 },
  storyDesc: { fontSize: 11, color: '#777', marginBottom: 4, lineHeight: 15 },
  storyDate: { fontSize: 10, color: '#999', marginBottom: 4 },
  readMore: { fontSize: 10, color: '#1B8A4C', fontWeight: '800', letterSpacing: 0.5 },
});