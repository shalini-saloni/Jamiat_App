import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CAMPAIGNS } from './HomeScreen';

const CATEGORIES = ['All', 'Food', 'Water', 'Health', 'Education', 'Zakat'];

export default function ExploreScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (route?.params?.searchQuery) {
      setSearch(route.params.searchQuery);
    }
  }, [route?.params?.searchQuery]);

  const filtered = CAMPAIGNS.filter((c) => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q
      || c.title.toLowerCase().includes(q)
      || c.desc.toLowerCase().includes(q)
      || c.tag.toLowerCase().includes(q);
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingTop: insets.top }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
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

      {/* Category pills - key fix: use inline backgroundColor directly on View */}
      <View style={styles.catRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor: isActive ? '#1B8A4C' : '#EFEFEF',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: isActive ? '#FFFFFF' : '#555555',
                    }}
                  >
                    {cat}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 46, marginBottom: 12 }}>🔍</Text>
          <Text style={styles.emptyTitle}>No campaigns found</Text>
          <Text style={styles.emptyDesc}>Try a different search or category</Text>
          <TouchableOpacity
            onPress={() => { setSearch(''); setActiveCategory('All'); }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearBtnText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <Text style={styles.resultCount}>{filtered.length} campaign{filtered.length !== 1 ? 's' : ''} found</Text>
          {filtered.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              onPress={() => navigation.navigate('Campaign', { campaign: c })}
            >
              <View style={styles.cardImgBox}>
                <Image source={c.image} style={styles.cardImg} />
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
                    <Text style={styles.raised}>₹{(c.raised / 1000).toFixed(0)}k raised</Text>
                    <Text style={styles.goal}>of ₹{(c.goal / 1000).toFixed(0)}k goal</Text>
                  </View>
                  <View style={styles.pctBadge}>
                    <Text style={styles.pctText}>{c.percent}%</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.donateBtn}
                  onPress={() => navigation.navigate('Donation', { campaign: c })}
                >
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
  header: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  searchWrap: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#EBEBEB' },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  catRow: { backgroundColor: '#fff', paddingBottom: 10 },
  catContent: { paddingHorizontal: 16, paddingTop: 4 },
  list: { paddingHorizontal: 16, paddingTop: 10 },
  resultCount: { fontSize: 12, color: '#999', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  cardImgBox: { width: '100%', height: 170 },
  cardImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  tagBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 5 },
  cardDesc: { fontSize: 12, color: '#777', marginBottom: 12, lineHeight: 18 },
  progressBg: { height: 7, backgroundColor: '#E8F5E9', borderRadius: 4, marginBottom: 10 },
  progressFill: { height: 7, backgroundColor: '#1B8A4C', borderRadius: 4 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  raised: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  goal: { fontSize: 11, color: '#999', marginTop: 1 },
  pctBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  pctText: { fontSize: 14, color: '#1B8A4C', fontWeight: '800' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingVertical: 13, borderRadius: 11, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: '#999', marginBottom: 20, textAlign: 'center' },
  clearBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  clearBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});