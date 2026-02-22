import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export const CAMPAIGNS = [
  { id: 1, tag: 'URGENT', tagColor: '#FF4444', title: 'Assam Flood Relief', desc: 'Providing food, clean water, and shelter to thousands affected by heavy floods', raised: 31000, goal: 50000, percent: 62, color: '#1B6B3A', emoji: '🌊', category: 'Relief' },
  { id: 2, tag: 'EDUCATION', tagColor: '#F5A623', title: 'Education for All', desc: 'Sponsoring quality education for underprivileged children across rural India', raised: 18000, goal: 30000, percent: 60, color: '#2E7D32', emoji: '📚', category: 'Education' },
  { id: 3, tag: 'HEALTH', tagColor: '#9C27B0', title: 'Medical Aid Gaza', desc: 'Urgent medical support and supplies for families in need', raised: 55000, goal: 80000, percent: 69, color: '#4A148C', emoji: '🏥', category: 'Health' },
  { id: 4, tag: 'WATER', tagColor: '#2196F3', title: 'Clean Water Yemen', desc: 'Providing safe drinking water to remote villages', raised: 22000, goal: 40000, percent: 55, color: '#0D47A1', emoji: '💧', category: 'Relief' },
  { id: 5, tag: 'ZAKAT', tagColor: '#1B8A4C', title: 'Zakat Distribution', desc: 'Annual Zakat distribution for poor families across India', raised: 120000, goal: 200000, percent: 60, color: '#1B5E20', emoji: '🤲', category: 'Zakat' },
  { id: 6, tag: 'FOOD', tagColor: '#FF5722', title: 'Ramadan Food Pack', desc: 'Food baskets for deserving families this Ramadan', raised: 38000, goal: 60000, percent: 63, color: '#BF360C', emoji: '🌙', category: 'Food' },
];

export const IMPACT_STORIES = [
  {
    id: 1, title: 'New community kitchen opened in Bihar', desc: 'Serving 200+ low income daily wage earners',
    fullStory: 'A brand-new community kitchen has been opened in the heart of Gaya, Bihar, thanks to the generous contributions of Jamiat donors. The kitchen serves over 200 daily wage workers and their families who previously had no access to a proper meal during the day.\n\nThe facility is equipped with modern cooking equipment and a dedicated team of volunteers who prepare freshly cooked meals every day. The initiative is part of Jamiat\'s broader effort to address hunger and food insecurity in underprivileged communities.\n\nFamilies who used to skip meals can now depend on this kitchen for one nutritious meal a day. Children are also benefiting, with a special evening meal program for school-going children of daily wage workers.',
    date: 'Oct 15, 2023', readTime: '2 MIN READ', category: 'FOOD SECURITY', color: '#BF360C', emoji: '🍲',
    quote: 'This kitchen has changed our lives. My children now eat a proper meal every evening.', quotePerson: 'Fatima, Daily Wage Worker',
    impact: [{ num: '200+', label: 'People fed daily' }, { num: '3', label: 'Meals served per day' }, { num: '40+', label: 'Children benefiting' }],
  },
  {
    id: 2, title: 'Clean water project completed in Yemen', desc: 'Safe drinking water accessible to over 1,500 villages',
    fullStory: 'After months of planning and construction, a major clean water project has been completed in rural Yemen, giving over 1,500 villages access to safe, clean drinking water for the first time in years.\n\nThe project involved drilling 12 deep water wells and installing a network of pipes. Water purification units ensure the water meets international safety standards.\n\nPrior to this project, women and children had to walk up to 5 kilometers daily to collect water from contaminated sources, leading to widespread waterborne illnesses. The new infrastructure has already reduced reported cases of diarrhea and cholera by 70%.',
    date: 'Sep 22, 2023', readTime: '3 MIN READ', category: 'CLEAN WATER', color: '#0D47A1', emoji: '💧',
    quote: 'We used to walk hours for water that made us sick. Now clean water is right here.', quotePerson: 'Ahmed, Village Elder',
    impact: [{ num: '1,500+', label: 'Villages with clean water' }, { num: '12', label: 'Wells drilled' }, { num: '70%', label: 'Reduction in waterborne illness' }],
  },
  {
    id: 3, title: 'School rebuilt after earthquake in Turkey', desc: '450 children back in classrooms after devastating quake',
    fullStory: 'Six months after the devastating earthquake that struck southern Turkey, Jamiat has successfully rebuilt a primary school in Hatay province, allowing 450 children to return to their education.\n\nThe school was completely destroyed in the 7.8-magnitude earthquake. Jamiat teams arrived within days of the disaster to provide emergency relief and quickly identified education as a critical need.\n\nThe new school building is earthquake-resistant, built to the latest Turkish safety standards. It includes 12 classrooms, a library, a computer lab, and separate facilities for boys and girls.',
    date: 'Aug 10, 2023', readTime: '4 MIN READ', category: 'EDUCATION', color: '#2E7D32', emoji: '🏫',
    quote: 'When we walked into the new school, the children started crying tears of joy.', quotePerson: 'Principal Ayşe, Hatay Primary School',
    impact: [{ num: '450', label: 'Children back in school' }, { num: '12', label: 'New classrooms built' }, { num: '28', label: 'Teachers employed' }],
  },
];

const QUICK_DONATIONS = [
  { icon: 'mosque', label: 'Zakat' },
  { icon: 'hand-holding-heart', label: 'Sadaqa' },
  { icon: 'globe', label: 'General' },
  { icon: 'hands-helping', label: 'Relief' },
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
            <Text style={styles.impactNumber}>{familiesImpacted > 0 ? `${familiesImpacted} ${familiesImpacted === 1 ? 'Family' : 'Families'}` : 'Start Giving'}</Text>
            <Text style={styles.impactSub}>{totalImpact > 0 ? `₹${totalImpact.toLocaleString()} donated across ${donations.length} donation${donations.length !== 1 ? 's' : ''}` : 'Make your first donation today'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
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
              onSubmitEditing={() => { if (search.trim()) navigation.navigate('Explore', { searchQuery: search }); }}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Urgent Relief */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Relief</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CAMPAIGNS.slice(0, 4).map((c) => (
              <TouchableOpacity key={c.id} style={styles.campaignCard} onPress={() => navigation.navigate('Campaign', { campaign: c })}>
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
              <TouchableOpacity key={q.label} style={styles.quickItem} onPress={() => navigation.navigate('Donation', { donationType: q.label })}>
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
            <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
              <Text style={styles.viewAll}>See Stories</Text>
            </TouchableOpacity>
          </View>
          {IMPACT_STORIES.slice(0, 2).map((s) => (
            <TouchableOpacity key={s.id} style={styles.storyCard} onPress={() => navigation.navigate('Story', { story: s })}>
              <View style={[styles.storyImageBox, { backgroundColor: s.color }]}>
                <Text style={{ fontSize: 32 }}>{s.emoji}</Text>
              </View>
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
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FF9800', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  notifBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  impactBanner: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  impactLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 },
  impactNumber: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  impactSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  searchRow: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
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
  quickIcon: { width: 62, height: 62, borderRadius: 18, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 13, color: '#333', fontWeight: '500' },
  storyCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  storyImageBox: { width: 80, height: 80, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  storyBody: { flex: 1 },
  storyTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 4, lineHeight: 18 },
  storyDesc: { fontSize: 11, color: '#777', marginBottom: 4, lineHeight: 15 },
  storyDate: { fontSize: 10, color: '#999', marginBottom: 4 },
  readMore: { fontSize: 10, color: '#1B8A4C', fontWeight: '700', letterSpacing: 0.5 },
});
