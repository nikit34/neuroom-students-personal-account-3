import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { mockSuggestedQuestions, mockFeedback } from '../../constants/mockData';
import { ChatMessage } from '../../types';

const aiResponses: Record<string, string> = {
  default:
    'Отличный вопрос! Давай разберёмся вместе. Какая конкретно часть задания вызывает сложности? Я могу объяснить теорию, показать пример или дать дополнительное задание для тренировки.',
  скобки:
    'При раскрытии скобок нужно умножить каждое слагаемое внутри скобок на множитель перед ними.\n\nНапример: 2(x + 3) = 2·x + 2·3 = 2x + 6\n\nВажно не забыть про знаки! Если перед скобками минус:\n-(x + 3) = -x - 3\n\nПопробуй раскрыть: 3(2x - 4) = ?',
  перенос:
    'При переносе через знак "=" число меняет свой знак на противоположный.\n\nПример:\n3x + 5 = 20\n3x = 20 - 5  (5 перенесли вправо, знак + стал -)\n3x = 15\n\nЭто работает, потому что мы фактически вычитаем 5 с обеих сторон:\n3x + 5 - 5 = 20 - 5\n3x = 15',
  пример:
    'Вот пример решения по шагам:\n\n4x - 3 = 2x + 7\n\nШаг 1: Переносим x в одну сторону\n4x - 2x = 7 + 3\n\nШаг 2: Упрощаем\n2x = 10\n\nШаг 3: Делим на коэффициент\nx = 5\n\nШаг 4: Проверка!\n4(5) - 3 = 2(5) + 7\n20 - 3 = 10 + 7\n17 = 17 ✓',
  ошибки:
    'Самые частые ошибки в уравнениях:\n\n1. Забыл сменить знак при переносе\n2. Умножил не все слагаемые при раскрытии скобок\n3. Забыл проверку подстановкой\n4. Неправильно складывал дроби\n\nМой совет: всегда делай проверку! Подставь найденный x в исходное уравнение.',
};

function getAiResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('скобк') || lower.includes('раскры')) return aiResponses['скобки'];
  if (lower.includes('перенос') || lower.includes('равно') || lower.includes('знак')) return aiResponses['перенос'];
  if (lower.includes('пример') || lower.includes('шаг')) return aiResponses['пример'];
  if (lower.includes('ошибк') || lower.includes('типичн')) return aiResponses['ошибки'];
  return aiResponses['default'];
}

export default function TutorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const messages = state.chatMessages[id!] || [];
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const feedback = mockFeedback[id!];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { assignmentId: id!, message: userMsg } });
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        text: getAiResponse(text),
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { assignmentId: id!, message: aiMsg } });
      setIsTyping(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Banner */}
      <View style={styles.banner}>
        <Ionicons name="information-circle" size={18} color={Colors.primary} />
        <Text style={styles.bannerText}>
          Это отдельный путь обучения. Тренируйся сколько угодно!
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Messages */}
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}
          >
            {msg.role === 'assistant' && (
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={16} color={Colors.primary} />
              </View>
            )}
            <View
              style={[
                styles.messageContent,
                msg.role === 'user' ? styles.userContent : styles.aiContent,
              ]}
            >
              <Text
                style={[styles.messageText, msg.role === 'user' && { color: '#FFF' }]}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color={Colors.primary} />
            </View>
            <View style={[styles.messageContent, styles.aiContent]}>
              <Text style={styles.typingDots}>...</Text>
            </View>
          </View>
        )}

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>Спроси у репетитора:</Text>
            {mockSuggestedQuestions.map((q, i) => (
              <TouchableOpacity key={i} onPress={() => sendMessage(q)} activeOpacity={0.7}>
                <Card padding={12}>
                  <View style={styles.suggestionRow}>
                    <Text style={styles.suggestionText}>{q}</Text>
                    <Ionicons name="arrow-forward-circle" size={20} color={Colors.primary} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quiz CTA */}
        {messages.length >= 3 && (
          <Card style={{ marginTop: 16 }}>
            <LinearGradient
              colors={[Colors.surfaceSecondary, Colors.surface]}
              style={styles.quizCta}
            >
              <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
              <Text style={styles.quizCtaTitle}>Готов проверить свои знания?</Text>
              <Text style={styles.quizCtaText}>Пройди квиз и получи достижение!</Text>
              <Button
                title="Пройти квиз"
                onPress={() => router.push(`/quiz/${id}`)}
                variant="primary"
                size="medium"
                icon={<Ionicons name="trophy-outline" size={18} color="#FFF" />}
              />
            </LinearGradient>
          </Card>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Задай вопрос..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={inputText.trim() ? '#FFF' : Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  bannerText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageContent: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userContent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  aiContent: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  typingDots: {
    fontSize: 20,
    color: Colors.textTertiary,
    letterSpacing: 4,
  },
  suggestions: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  quizCta: {
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 12,
  },
  quizCtaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quizCtaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.borderLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: Colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: Colors.borderLight,
  },
});
