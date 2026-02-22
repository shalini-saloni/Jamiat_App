import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CAMPAIGNS } from './HomeScreen';

const CATEGORIES = ['All', 'Relief', 'Education', 'Health', 'Zakat', 'Food'];

export default function ExploreScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (route?.params?.searchQuery) {
      setSearch(route.params.searchQuery);
    }
  }, [route?.params?.searchQuery]);

  const filtered = CAMPAIGNS.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Campaigns</Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search campaigns..."
            placeholderTextColor="#aaa"
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
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContainer}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
          >
            <Text style={[styles.catPillText, activeCategory === cat && styles.catPillTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No campaigns found</Text>
          <Text style={styles.emptyDesc}>Try a different search term or category</Text>
          <TouchableOpacity onPress={() => { setSearch(''); setActiveCategory('All'); }} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <Text style={styles.resultCount}>{filtered.length} campaign{filtered.length !== 1 ? 's' : ''} found</Text>
          {filtered.map((c) => (
            <TouchableOpacity key={c.id} style={styles.card} onPress={() => navigation.navigate('Campaign', { campaign: c })}>
              <View style={styles.cardImageBox}>
                <Image source={c.image} style={styles.cardImage} />
                <View style={[styles.tagBadge, { backgroundColor: c.tagColor }]}>
                  <Text style={styles.tagText}>{c.tag}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{c.desc}</Text>
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  searchWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, backgroundColor: '#fff' },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  catScroll: { maxHeight: 52, backgroundColor: '#fff' },
  catContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 0,
    minWidth: 50,
    alignItems: 'center',
  },
  catPillActive: {
    backgroundColor: '#1B8A4C',
  },
  catPillText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  catPillTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  resultCount: { fontSize: 12, color: '#999', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  cardImageBox: { width: '100%', height: 170, position: 'relative' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
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
  percentBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  percentText: { fontSize: 14, color: '#1B8A4C', fontWeight: '800' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingVertical: 13, borderRadius: 11, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: '#999', marginBottom: 20, textAlign: 'center' },
  clearBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  clearBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
