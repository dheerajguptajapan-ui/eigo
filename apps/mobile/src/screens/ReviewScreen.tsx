import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, Animated } from 'react-native';
import { ChevronLeft, Volume2, CheckCircle2, RotateCcw, HelpCircle, Star } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const ReviewScreen = ({ navigation }: any) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    fetchUser();
  }, []);

  const { data: dueCards, isLoading } = useQuery({
    queryKey: ['dueCards'],
    queryFn: async () => {
      const response = await api.get(`/srs/due?userId=${user.id}`);
      return response.data;
    },
    enabled: !!user,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ cardId, rating }: { cardId: string; rating: number }) => {
      const response = await api.post('/srs/review', { cardId, rating });
      return response.data;
    },
    onSuccess: () => {
      if (currentIndex < (dueCards?.length || 0) - 1) {
        animateNext();
      } else {
        queryClient.invalidateQueries({ queryKey: ['dueCards'] });
      }
    },
  });

  const animateNext = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowAnswer(false);
      setCurrentIndex(currentIndex + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  if (isLoading || !user) return <View style={styles.center}><Text>読み込み中...</Text></View>;

  if (!dueCards || dueCards.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: '#f8fafc', padding: 24 }]}>
        <View style={styles.congratsCard}>
          <View style={styles.congratsIcon}>
            <CheckCircle2 size={40} color="#10b981" />
          </View>
          <Text style={styles.congratsTitle}>お疲れ様でした！</Text>
          <Text style={styles.congratsSub}>今日の復習はすべて完了しました。</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ホーム')}>
            <Text style={styles.backButtonText}>ダッシュボードへ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentCard = dueCards[currentIndex];
  const progress = (currentIndex / dueCards.length) * 100;

  const handleRate = (rating: number) => {
    reviewMutation.mutate({ cardId: currentCard.id, rating });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#64748b" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentIndex + 1}/{dueCards.length}</Text>
      </View>

      <Animated.View style={[styles.main, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          activeOpacity={0.9}
          style={[styles.card, showAnswer && styles.cardActive]} 
          onPress={() => !showAnswer && setShowAnswer(true)}
        >
          {!showAnswer ? (
            <View style={styles.cardSide}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>日本語を英語に</Text>
              </View>
              <Text style={styles.japaneseText}>{currentCard.vocabulary_item.japanese_translation}</Text>
              <View style={styles.hintContainer}>
                <HelpCircle size={16} color="#94a3b8" />
                <Text style={styles.hintText}>タップして正解を表示</Text>
              </View>
            </View>
          ) : (
            <View style={styles.cardSide}>
              <Text style={styles.englishText}>{currentCard.vocabulary_item.english_word}</Text>
              <View style={styles.pronounceContainer}>
                <Text style={styles.ipaText}>{currentCard.vocabulary_item.ipa_phonetic}</Text>
                <TouchableOpacity style={styles.audioIcon}>
                  <Volume2 size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <Text style={styles.posText}>{currentCard.vocabulary_item.part_of_speech}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {showAnswer && (
        <View style={styles.ratingContainer}>
          {[
            { label: 'Again', rating: 1, sub: '忘れた', color: '#f43f5e', icon: RotateCcw },
            { label: 'Hard', rating: 2, sub: '難しい', color: '#f59e0b', icon: HelpCircle },
            { label: 'Good', rating: 3, sub: '正解', color: '#6366f1', icon: CheckCircle2 },
            { label: 'Easy', rating: 4, sub: '完璧', color: '#10b981', icon: Star },
          ].map((btn) => (
            <TouchableOpacity
              key={btn.rating}
              style={[styles.ratingButton, { backgroundColor: btn.color }]}
              onPress={() => handleRate(btn.rating)}
              disabled={reviewMutation.isPending}
            >
              <Text style={styles.ratingLabel}>{btn.label}</Text>
              <Text style={styles.ratingSub}>{btn.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    width: 35,
  },
  main: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 40,
    minHeight: 400,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  cardActive: {
    backgroundColor: '#6366f1',
  },
  cardSide: {
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  badgeText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  japaneseText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  hintText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
  },
  englishText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  pronounceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  ipaText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  audioIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 32,
  },
  posText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  ratingSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  congratsCard: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  congratsIcon: {
    backgroundColor: '#ecfdf5',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  congratsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 8,
  },
  congratsSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default ReviewScreen;
