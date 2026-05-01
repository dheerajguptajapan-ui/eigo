import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Flame, Star, BookOpen, GraduationCap, ChevronRight, Trophy } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import * as SecureStore from 'expo-secure-store';

const HomeScreen = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    fetchUser();
  }, []);

  const { data: dueCards, isLoading: isLoadingDue } = useQuery({
    queryKey: ['dueCards'],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/srs/due?userId=${user.id}`);
      return response.data;
    },
    enabled: !!user,
  });

  const dueCount = dueCards?.length || 0;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>おかえり、{user?.username || '学習者'}さん！</Text>
            <Text style={styles.subtitleText}>継続は力なり！</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame size={20} color="#f97316" fill="#f97316" />
            <Text style={styles.streakText}>72 日</Text>
          </View>
        </View>

        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelLabel}>現在のレベル</Text>
            <GraduationCap size={20} color="rgba(255,255,255,0.8)" />
          </View>
          <Text style={styles.levelTitle}>英語の芽 (Me)</Text>
          <Text style={styles.levelSub}>次のランク: 英語の花 (Hana) まで 1,250 XP</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Star size={20} color="#eab308" />
            <Text style={styles.statValue}>{isLoadingDue ? '...' : `${dueCount} 単語`}</Text>
            <Text style={styles.statLabel}>今日の復習</Text>
            <TouchableOpacity 
              style={[styles.reviewButton, dueCount === 0 && { opacity: 0.5 }]} 
              disabled={dueCount === 0 || isLoadingDue}
            >
              <Text style={styles.reviewButtonText}>開始</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statCard}>
            <Trophy size={20} color="#6366f1" />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>週間の目標</Text>
            <View style={styles.dotsContainer}>
              {[1, 2, 3, 4, 5, 0, 0].map((v, i) => (
                <View key={i} style={[styles.dot, v ? styles.dotActive : styles.dotInactive]} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>おすすめのレッスン</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>すべて見る</Text>
          </TouchableOpacity>
        </View>

        {[
          { title: "レストランでの注文", type: "会話・リスニング", xp: "+50 XP", color: "#f43f5e" },
          { title: "過去形 (Basic Past Tense)", type: "文法", xp: "+40 XP", color: "#0ea5e9" },
          { title: "道案内をマスターする", type: "スピーキング", xp: "+60 XP", color: "#10b981" },
        ].map((lesson, i) => (
          <TouchableOpacity key={i} style={styles.lessonItem}>
            <View style={[styles.lessonIcon, { backgroundColor: lesson.color }]}>
              <BookOpen size={20} color="#fff" />
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonType}>{lesson.type}</Text>
            </View>
            <Text style={styles.lessonXp}>{lesson.xp}</Text>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e1b4b',
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#c2410c',
    marginLeft: 6,
  },
  levelCard: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
  },
  levelTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  levelSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginTop: 16,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  reviewButton: {
    backgroundColor: '#eab308',
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  reviewButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: '#6366f1',
  },
  dotInactive: {
    backgroundColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  lessonIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
  },
  lessonType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  lessonXp: {
    fontSize: 14,
    fontWeight: '900',
    color: '#6366f1',
    marginRight: 4,
  },
});

export default HomeScreen;
