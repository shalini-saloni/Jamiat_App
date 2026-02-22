import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMPACT_STORIES } from './HomeScreen';

export default function StoriesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impact Stories</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>See how your donations are changing lives around the world</Text>
        {IMPACT_STORIES.map((story) => (
          <TouchableOpacity key={story.id} style={styles.card} onPress={() => navigation.navigate('Story', { story })}>
            <View style={[styles.cardImage, { backgroundColor: story.color }]}>
              <Text style={{ fontSize: 56 }}>{story.emoji}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{story.category}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.metaRow}>
                <Text style={styles.date}>{story.date}</Text>
                <Text style={styles.readTime}>{story.readTime}</Text>
              </View>
              <Text style={styles.title}>{story.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>{story.desc}</Text>
              {story.impact && (
                <View style={styles.impactRow}>
                  {story.impact.slice(0, 2).map((imp, i) => (
                    <View key={i} style={styles.impactChip}>
                      <Text style={styles.impactNum}>{imp.num}</Text>
                      <Text style={styles.impactLabel}>{imp.label}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.readMoreRow}>
                <Text style={styles.readMore}>READ FULL STORY</Text>
                <Ionicons name="arrow-forward" size={14} color="#1B8A4C" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  content: { padding: 16 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 18 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 18, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  cardImage: { height: 170, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  categoryText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { padding: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  date: { fontSize: 11, color: '#999' },
  readTime: { fontSize: 11, color: '#1B8A4C', fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 6, lineHeight: 22 },
  desc: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 12 },
  impactRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  impactChip: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  impactNum: { fontSize: 14, fontWeight: '800', color: '#1B8A4C' },
  impactLabel: { fontSize: 10, color: '#555', marginTop: 1 },
  readMoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readMore: { fontSize: 12, color: '#1B8A4C', fontWeight: '800', letterSpacing: 0.5 },
});
