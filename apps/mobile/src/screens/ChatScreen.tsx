import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { ChevronLeft, Send, Sparkles, User, MessageCircle } from 'lucide-react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

const ChatScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const { data: scenarios, isLoading: isLoadingScenarios } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      const response = await api.get('/ai/scenarios');
      return response.data;
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (newMessages: any[]) => {
      const response = await api.post('/ai/chat', { scenarioId, messages: newMessages });
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data]);
    },
  });

  const startScenario = (scenario: any) => {
    setScenarioId(scenario.id);
    setMessages([{ role: 'assistant', content: scenario.initial_message }]);
  };

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    chatMutation.mutate(updatedMessages);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[styles.messageWrapper, item.role === 'user' ? styles.userWrapper : styles.aiWrapper]}>
      <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.aiText]}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  if (!scenarioId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI会話練習</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.scenarioList}>
          <Text style={styles.listSubtitle}>シチュエーションを選んで練習を開始しましょう</Text>
          {isLoadingScenarios ? (
            <ActivityIndicator color="#6366f1" size="large" style={{ marginTop: 40 }} />
          ) : (
            scenarios?.map((s: any) => (
              <TouchableOpacity key={s.id} style={styles.scenarioCard} onPress={() => startScenario(s)}>
                <View style={styles.scenarioIcon}>
                  <Sparkles size={24} color="#6366f1" />
                </View>
                <View style={styles.scenarioInfo}>
                  <Text style={styles.scenarioTitle}>{s.title_ja}</Text>
                  <Text style={styles.scenarioDesc}>{s.description_ja}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScenarioId(null)}>
          <ChevronLeft size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{scenarios?.find((s: any) => s.id === scenarioId)?.title_ja}</Text>
        <Sparkles size={20} color="#6366f1" />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={chatMutation.isPending ? (
          <View style={styles.typingContainer}>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#94a3b8" />
            </View>
          </View>
        ) : null}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="英語で話してみましょう..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && { opacity: 0.5 }]} 
            onPress={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
          >
            <Send size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  scenarioList: {
    padding: 24,
  },
  listSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 24,
  },
  scenarioCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  scenarioIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scenarioInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  scenarioDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 24,
  },
  userBubble: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#1e293b',
  },
  typingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});

export default ChatScreen;
