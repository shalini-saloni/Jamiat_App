import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StoryScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const story = route?.params?.story || {};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impact Story</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {story.image ? (
          <Image source={story.image} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroFallback, { backgroundColor: story.color || '#1B6B3A' }]} />
        )}

        <View style={styles.content}>
          <View style={styles.meta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{story.category || 'IMPACT STORY'}</Text>
            </View>
            <Text style={styles.readTime}>{story.readTime || '3 MIN READ'}</Text>
          </View>

          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.date}>{story.date || ''}</Text>
          <Text style={styles.body}>{story.fullStory || story.desc}</Text>

          {story.quote && (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>"{story.quote}"</Text>
              {story.quotePerson && (
                <Text style={styles.quotePerson}>— {story.quotePerson}</Text>
              )}
            </View>
          )}

          {story.impact && (
            <View style={styles.impactBox}>
              <Text style={styles.impactTitle}>📊 Impact Numbers</Text>
              {story.impact.map((item, i) => (
                <View key={i} style={styles.impactRow}>
                  <Text style={styles.impactNum}>{item.num}</Text>
                  <Text style={styles.impactLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.donateBtn} onPress={() => navigation.navigate('Donation')}>
          <Text style={styles.donateBtnText}>Support This Cause ♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 36 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  heroImage: { width: '100%', height: 240, resizeMode: 'cover' },
  heroFallback: { width: '100%', height: 240 },
  content: { padding: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  categoryBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  categoryText: { color: '#1B8A4C', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  readTime: { fontSize: 11, color: '#999' },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', lineHeight: 30, marginBottom: 8 },
  date: { fontSize: 12, color: '#999', marginBottom: 16 },
  body: { fontSize: 15, color: '#444', lineHeight: 24, marginBottom: 20 },
  quoteBox: { backgroundColor: '#F0FFF4', borderLeftWidth: 4, borderLeftColor: '#1B8A4C', padding: 16, borderRadius: 8, marginBottom: 20 },
  quoteText: { fontSize: 15, color: '#1B8A4C', fontStyle: 'italic', lineHeight: 22 },
  quotePerson: { fontSize: 13, color: '#555', marginTop: 8, fontWeight: '600' },
  impactBox: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 16, marginBottom: 20 },
  impactTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  impactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  impactNum: { fontSize: 22, fontWeight: '800', color: '#1B8A4C', width: 90 },
  impactLabel: { fontSize: 13, color: '#555', flex: 1 },
  footer: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  donateBtn: { backgroundColor: '#1B8A4C', paddingVertical: 15, borderRadius: 13, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});