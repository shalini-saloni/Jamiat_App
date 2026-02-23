import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CAMPAIGNS } from './HomeScreen';

const CATEGORIES = ['All', 'Food', 'Water', 'Health', 'Education', 'Zakat'];

const LOCATION_MAP = {
  1: 'Assam, India',
  2: 'Rural India',
  3: 'Gaza Region',
  4: 'Rural Mewat',
  5: 'Pan India',
  6: 'Pan India',
};

export default function ExploreScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (route?.params?.searchQuery) setSearch(route.params.searchQuery);
  }, [route?.params?.searchQuery]);

  const filtered = CAMPAIGNS.filter((c) => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q
      || c.title.toLowerCase().includes(q)
      || c.desc.toLowerCase().includes(q)
      || c.tag.toLowerCase().includes(q)
      || c.category.toLowerCase().includes(q);
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingTop: insets.top }}>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color="#bbb" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search campaigns..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color="#bbb" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={{ marginLeft: 8 }}>
            <Ionicons name="options-outline" size={18} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category pills */}
      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)} activeOpacity={0.8}>
                <View style={{
                  paddingHorizontal: 20,
                  paddingVertical: 9,
                  borderRadius: 22,
                  marginRight: 8,
                  backgroundColor: isActive ? '#1B8A4C' : '#F0F0F0',
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: isActive ? '#fff' : '#555',
                  }}>{cat}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Campaign list */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 44, marginBottom: 12 }}>🔍</Text>
          <Text style={styles.emptyTitle}>No campaigns found</Text>
          <TouchableOpacity onPress={() => { setSearch(''); setActiveCategory('All'); }} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {filtered.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              activeOpacity={0.95}
              onPress={() => navigation.navigate('Campaign', { campaign: c })}
            >
              {/* Image + priority badge */}
              <View style={styles.imgBox}>
                <Image source={c.image} style={styles.cardImg} />
                <View style={[styles.priorityBadge, { backgroundColor: c.tagColor }]}>
                  <Text style={styles.priorityText}>{c.tag === 'URGENT' ? 'HIGH PRIORITY' : c.tag}</Text>
                </View>
              </View>

              {/* Card body */}
              <View style={styles.cardBody}>
                {/* Category · Location */}
                <View style={styles.metaRow}>
                  <Text style={[styles.categoryText, { color: c.tagColor }]}>{c.category.toUpperCase()}</Text>
                  <Text style={styles.metaDot}> · </Text>
                  <Text style={styles.locationText}>{LOCATION_MAP[c.id] || 'India'}</Text>
                </View>

                {/* Title */}
                <Text style={styles.cardTitle}>{c.title}</Text>

                {/* Description */}
                <Text style={styles.cardDesc} numberOfLines={3}>{c.desc}</Text>

                {/* % Raised + Goal on same line */}
                <View style={styles.pctRow}>
                  <Text style={styles.pctText}><Text style={styles.pctNum}>{c.percent}%</Text> Raised</Text>
                  <Text style={styles.goalText}>Goal: ₹{(c.goal / 100000).toFixed(0)}L</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${c.percent}%` }]} />
                </View>

                {/* AMOUNT RAISED + Donate Now button */}
                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.amountLabel}>AMOUNT RAISED</Text>
                    <Text style={styles.amountValue}>₹{(c.raised / 100000).toFixed(1)}L</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.donateBtn}
                    onPress={() => navigation.navigate('Donation', { campaign: c })}
                  >
                    <Text style={styles.donateBtnText}>Donate Now</Text>
                  </TouchableOpacity>
                </View>
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
  searchWrap: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#EBEBEB' },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },

  catWrap: { backgroundColor: '#fff', paddingBottom: 12 },
  catContent: { paddingHorizontal: 16, paddingTop: 4, gap: 0 },

  list: { paddingHorizontal: 16, paddingTop: 12 },

  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },

  imgBox: { width: '100%', height: 200, position: 'relative' },
  cardImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  priorityBadge: { position: 'absolute', top: 14, left: 14, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  priorityText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  cardBody: { padding: 16 },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  metaDot: { fontSize: 12, color: '#bbb' },
  locationText: { fontSize: 12, color: '#888', fontWeight: '500' },

  cardTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 8, lineHeight: 26 },
  cardDesc: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 14 },

  pctRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pctText: { fontSize: 14, color: '#555' },
  pctNum: { fontSize: 16, fontWeight: '800', color: '#1B8A4C' },
  goalText: { fontSize: 13, color: '#999' },

  progressBg: { height: 7, backgroundColor: '#E8F5E9', borderRadius: 4, marginBottom: 14 },
  progressFill: { height: 7, backgroundColor: '#1B8A4C', borderRadius: 4 },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { fontSize: 10, fontWeight: '700', color: '#aaa', letterSpacing: 0.8, marginBottom: 3 },
  amountValue: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 24, paddingVertical: 13, borderRadius: 10 },
  donateBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
  clearBtn: { backgroundColor: '#1B8A4C', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  clearBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});