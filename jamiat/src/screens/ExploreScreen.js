import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CAMPAIGNS } from './HomeScreen';

const CATEGORIES = ['All', 'Relief', 'Education', 'Health', 'Zakat', 'Food'];

export default function ExploreScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState(route?.params?.searchQuery || '');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (route?.params?.searchQuery) {
      setSearch(route.params.searchQuery);
    }
  }, [route?.params?.searchQuery]);

  const filtered = CAMPAIGNS.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.tag.toLowerCase().includes(search.toLowerCase());
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
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color="#bbb" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categories}
      >
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

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No campaigns found</Text>
          <Text style={styles.emptyDesc}>Try a different search or category</Text>
          <TouchableOpacity onPress={() => { setSearch(''); setActiveCategory('All'); }}>
            <Text style={styles.clearBtn}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <Text style={styles.resultCount}>{filtered.length} campaign{filtered.length !== 1 ? 's' : ''} found</Text>
          {filtered.map((c) => (
            <TouchableOpacity key={c.id} style={styles.card} onPress={() => navigation.navigate('Campaign', { campaign: c })}>
              <View style={[styles.cardImage, { backgroundColor: c.color }]}>
                <Text style={{ fontSize: 48 }}>{c.emoji}</Text>
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
                <View style={styles.cardStats}>
                  <View>
                    <Text style={styles.raisedAmount}>₹{(c.raised / 1000).toFixed(0)}k raised</Text>
                    <Text style={styles.goalText}>of ₹{(c.goal / 1000).toFixed(0)}k goal</Text>
                  </View>
                  <View style={styles.percentBadge}>
                    <Text style={styles.percentText}>{c.percent}%</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.donateBtn} onPress={() => navigation.navigate('Donation', { campaign: c })}>
                  <Text style={styles.donateBtnText}>Donate Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  categoriesScroll: { maxHeight: 54, marginTop: 10 },
  categories: { paddingHorizontal: 16, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E0E0E0' },
  catBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  catText: { fontSize: 13, color: '#555', fontWeight: '600' },
  catTextActive: { color: '#fff', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  resultCount: { fontSize: 12, color: '#999', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  cardImage: { height: 160, alignItems: 'center', justifyContent: 'center' },
  tagBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 5 },
  cardDesc: { fontSize: 12, color: '#777', marginBottom: 12, lineHeight: 18 },
  progressBg: { height: 7, backgroundColor: '#E8F5E9', borderRadius: 4, marginBottom: 10 },
  progressFill: { height: 7, backgroundColor: '#1B8A4C', borderRadius: 4 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  raisedAmount: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  goalText: { fontSize: 11, color: '#999', marginTop: 1 },
  percentBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  percentText: { fontSize: 13, color: '#1B8A4C', fontWeight: '800' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingVertical: 13, borderRadius: 11, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: '#999', marginBottom: 16 },
  clearBtn: { color: '#1B8A4C', fontWeight: '700', fontSize: 14 },
});
