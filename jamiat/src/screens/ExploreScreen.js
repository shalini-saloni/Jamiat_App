import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ALL_CAMPAIGNS = [
  { id: 1, tag: 'URGENT', tagColor: '#FF4444', title: 'Assam Flood Relief', desc: 'Providing flood, clean water, and shelter', raised: 31000, goal: 50000, percent: 62, color: '#1B6B3A', emoji: '🌊', category: 'Relief' },
  { id: 2, tag: 'EDUCATION', tagColor: '#F5A623', title: 'Education for All', desc: 'Sponsoring quality education for children', raised: 18000, goal: 30000, percent: 60, color: '#2E7D32', emoji: '📚', category: 'Education' },
  { id: 3, tag: 'HEALTH', tagColor: '#9C27B0', title: 'Medical Aid Gaza', desc: 'Urgent medical support for families', raised: 55000, goal: 80000, percent: 69, color: '#4A148C', emoji: '🏥', category: 'Health' },
  { id: 4, tag: 'WATER', tagColor: '#2196F3', title: 'Clean Water Yemen', desc: 'Providing safe drinking water', raised: 22000, goal: 40000, percent: 55, color: '#0D47A1', emoji: '💧', category: 'Relief' },
  { id: 5, tag: 'ZAKAT', tagColor: '#1B8A4C', title: 'Zakat Distribution', desc: 'Annual Zakat for poor families', raised: 120000, goal: 200000, percent: 60, color: '#1B5E20', emoji: '🤲', category: 'Zakat' },
  { id: 6, tag: 'FOOD', tagColor: '#FF5722', title: 'Ramadan Food Pack', desc: 'Food baskets for families this Ramadan', raised: 38000, goal: 60000, percent: 63, color: '#BF360C', emoji: '🌙', category: 'Food' },
];

const CATEGORIES = ['All', 'Relief', 'Education', 'Health', 'Zakat', 'Food'];

export default function ExploreScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ALL_CAMPAIGNS.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Campaigns</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search campaigns..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.catBtn, activeCategory === c && styles.catBtnActive]}
            onPress={() => setActiveCategory(c)}
          >
            <Text style={[styles.catText, activeCategory === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.card}
            onPress={() => navigation.navigate('Campaign', { campaign: c })}
          >
            <View style={[styles.cardImage, { backgroundColor: c.color }]}>
              <Text style={{ fontSize: 44 }}>{c.emoji}</Text>
              <View style={[styles.tagBadge, { backgroundColor: c.tagColor }]}>
                <Text style={styles.tagText}>{c.tag}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardDesc}>{c.desc}</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${c.percent}%` }]} />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.raisedText}>₹{(c.raised / 1000).toFixed(0)}k raised</Text>
                <Text style={styles.percentText}>{c.percent}%</Text>
              </View>
              <TouchableOpacity
                style={styles.donateBtn}
                onPress={() => navigation.navigate('Donation', { type: 'Sadaqa' })}
              >
                <Text style={styles.donateBtnText}>Donate Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  categories: { paddingHorizontal: 16, paddingVertical: 12, maxHeight: 56 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  catBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  catText: { fontSize: 13, color: '#666', fontWeight: '500' },
  catTextActive: { color: '#fff', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  cardImage: { height: 150, alignItems: 'center', justifyContent: 'center' },
  tagBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#777', marginBottom: 10, lineHeight: 17 },
  progressBg: { height: 6, backgroundColor: '#E8F5E9', borderRadius: 3, marginBottom: 8 },
  progressFill: { height: 6, backgroundColor: '#1B8A4C', borderRadius: 3 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  raisedText: { fontSize: 12, color: '#555', fontWeight: '500' },
  percentText: { fontSize: 12, color: '#1B8A4C', fontWeight: '700' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
